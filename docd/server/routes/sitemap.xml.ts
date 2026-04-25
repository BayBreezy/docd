import { queryCollection } from "@nuxt/content/server";

import { getCollectionsToQuery } from "../utils/content";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const siteUrl = (config.public.siteUrl as string | undefined) || "";

  const collections = getCollectionsToQuery();
  const urls: SitemapUrl[] = [];

  for (const collection of collections) {
    try {
      const pages = await (
        queryCollection as unknown as (
          event: unknown,
          collection: string
        ) => { all: () => Promise<Array<Record<string, unknown> & { path?: string }>> }
      )(event, collection).all();

      for (const page of pages) {
        const pagePath = page.path || "/";

        if (page.sitemap === false) continue;
        if (pagePath.endsWith(".navigation") || pagePath.includes("/.navigation")) continue;

        const entry: SitemapUrl = { loc: pagePath };

        if (page.modifiedAt && typeof page.modifiedAt === "string") {
          entry.lastmod = (page.modifiedAt as string).split("T")[0];
        }

        urls.push(entry);
      }
    } catch {
      // Collection may not exist in this app — skip
    }
  }

  setResponseHeader(event, "content-type", "application/xml");
  return generateSitemap(urls, siteUrl);
});

function generateSitemap(urls: SitemapUrl[], siteUrl: string): string {
  const urlEntries = urls
    .map((url) => {
      const loc = siteUrl ? `${siteUrl}${url.loc}` : url.loc;
      let entry = `  <url>\n    <loc>${escapeXml(loc)}</loc>`;
      if (url.lastmod) entry += `\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>`;
      entry += `\n  </url>`;
      return entry;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
