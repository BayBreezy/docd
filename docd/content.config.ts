import {
  defineCollection,
  defineContentConfig,
  type DefinedCollection,
  property,
} from "@nuxt/content";
import { useNuxt, createResolver } from "@nuxt/kit";
import { joinURL } from "ufo";
import { z } from "zod";

import { componentApiSchema } from "./utils/component-api-schema";
import { landingPageExists, docsFolderExists } from "./utils/pages";

const resolver = createResolver(import.meta.url);

const { options } = useNuxt();
const cwd = joinURL(options.rootDir, "content");
const hasLandingPage = landingPageExists(options.rootDir);
const hasDocsFolder = docsFolderExists(options.rootDir);

let collections: Record<string, DefinedCollection> = {};

const baseSchema = z.object({
  links: z
    .array(
      z.object({
        title: z.string(),
        href: z.string(),
        icon: z.string().optional(),
      })
    )
    .optional(),
  fancyIcon: property(z.object({})).inherit(resolver.resolve("./app/components/Ui/FancyIcon.vue")),
  hideToc: z.boolean().optional().default(false),
  navigation: z
    .union([
      z.boolean(),
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
      }),
    ])
    .default(true),
  publishedAt: z.iso.date().optional(),
  modifiedAt: z.iso.date().optional(),
  layout: z.string().optional(),
  componentApi: componentApiSchema,
});

const docsSchema = baseSchema.extend({
  label: z.string().optional(),
  target: z.string().optional(),
  layout: z.string().default("docs").optional(),
});

collections = {
  docs: defineCollection({
    // Specify the type of content in this collection
    type: "page",
    // Load every file inside the `content` directory
    source: {
      cwd,
      include: hasDocsFolder ? "docs/**" : "**",
      prefix: hasDocsFolder ? "/docs" : "/",
      exclude: ["index.md"],
    },
    schema: docsSchema,
  }),
};

if (!hasLandingPage) {
  collections.landing = defineCollection({
    type: "page",
    source: {
      cwd,
      include: "index.md",
    },
    schema: baseSchema,
  });
}

export default defineContentConfig({ collections });
