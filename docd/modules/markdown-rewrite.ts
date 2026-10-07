import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { defineNuxtModule, logger } from "@nuxt/kit";

const log = logger.withTag("Docd");

/** Subset of the Vercel Build Output API route we generate. */
type VercelRoute = {
  src: string;
  dest?: string;
  headers?: Record<string, string>;
  has?: Array<{ type: "header" | "cookie" | "query" | "host"; key: string; value: string }>;
  /** Apply the headers, then keep matching the following routes. */
  continue?: boolean;
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default defineNuxtModule({
  meta: {
    name: "docd:markdown-rewrite",
  },
  setup(_options, nuxt) {
    nuxt.hooks.hook("nitro:init", (nitro) => {
      if (nitro.options.dev || !nitro.options.preset.includes("vercel")) {
        return;
      }

      nitro.hooks.hook("compiled", async () => {
        const vcJSON = resolve(nitro.options.output.dir, "config.json");
        const vcConfig = JSON.parse(await readFile(vcJSON, "utf8"));

        // Check if llms.txt exists before setting up any routes
        let llmsTxt: string;
        const llmsTxtPath = resolve(nitro.options.output.publicDir, "llms.txt");
        try {
          llmsTxt = await readFile(llmsTxtPath, "utf-8");
        } catch {
          log.warn("llms.txt not found, skipping markdown redirect routes");
          return;
        }

        // Always redirect / to /llms.txt and ensure plain text content type.
        // `vary` tells CDNs the body depends on the request headers: without it,
        // whichever variant lands in the cache first is served to everyone.
        const markdownHeaders = {
          "content-type": "text/markdown; charset=utf-8",
          vary: "Accept, User-Agent",
        };

        // Paths answering in two representations. Their HTML variant needs the same
        // `vary`, otherwise a cached HTML response can be handed to an agent (and vice versa).
        const negotiatedPaths: string[] = ["/"];

        const routes: VercelRoute[] = [
          {
            src: "^/$",
            dest: "/llms.txt",
            headers: markdownHeaders,
            has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
          },
          {
            src: "^/$",
            dest: "/llms.txt",
            headers: markdownHeaders,
            has: [{ type: "header", key: "user-agent", value: "curl/.*" }],
          },
        ];

        // Parse llms.txt to get all documentation page URLs
        const urlRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
        const matches = [...llmsTxt.matchAll(urlRegex)];

        for (const match of matches) {
          const url = match[2];
          if (!url) continue;

          try {
            const urlObj = new URL(url);
            const rawPath = urlObj.pathname;

            if (rawPath === "/") continue;
            if (!rawPath.startsWith("/raw/")) continue;

            // Convert /raw/getting-started/installation.md → /getting-started/installation
            const pagePath = rawPath.replace("/raw", "").replace(/\.md$/, "");

            routes.push(
              {
                src: `^${escapeRegex(pagePath)}$`,
                dest: rawPath,
                headers: markdownHeaders,
                has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
              },
              {
                src: `^${escapeRegex(pagePath)}$`,
                dest: rawPath,
                headers: markdownHeaders,
                has: [{ type: "header", key: "user-agent", value: "curl/.*" }],
              }
            );
            negotiatedPaths.push(pagePath);
          } catch {
            // Skip invalid URLs
          }
        }

        // Runs after the rewrites above, which terminate for markdown clients,
        // so only the HTML variant reaches this rule.
        routes.push({
          src: `^(${negotiatedPaths.map(escapeRegex).join("|")})$`,
          headers: { vary: "Accept, User-Agent" },
          continue: true,
        });

        vcConfig.routes.unshift(...routes);

        await writeFile(vcJSON, JSON.stringify(vcConfig, null, 2), "utf8");
        log.info(`Wrote ${routes.length} markdown redirect routes for AI agents`);
      });
    });
  },
});
