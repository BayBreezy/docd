import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { defineNuxtModule, logger } from "@nuxt/kit";

const log = logger.withTag("Docd");

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

        // Always redirect / to /llms.txt and ensure plain text content type
        const markdownHeaders = {
          "content-type": "text/markdown; charset=utf-8",
        };

        const routes = [
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
                src: `^${pagePath}$`,
                dest: rawPath,
                headers: markdownHeaders,
                has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
              },
              {
                src: `^${pagePath}$`,
                dest: rawPath,
                headers: markdownHeaders,
                has: [{ type: "header", key: "user-agent", value: "curl/.*" }],
              }
            );
          } catch {
            // Skip invalid URLs
          }
        }

        vcConfig.routes.unshift(...routes);

        await writeFile(vcJSON, JSON.stringify(vcConfig, null, 2), "utf8");
        log.info(`Wrote ${routes.length} markdown redirect routes for AI agents`);
      });
    });
  },
});
