import { z } from "zod";

import { DEFAULT_COMPONENT_API_LAYOUT, DEFAULT_COMPONENT_API_SECTIONS } from "./component-api";

const componentApiLayoutSchema = z.enum(["field", "table"]);
const componentApiSectionsSchema = z
  .array(z.enum(["props", "slots", "events", "exposed"]))
  .default([...DEFAULT_COMPONENT_API_SECTIONS]);

const componentApiComponentSchema = z.object({
  path: z.string(),
  title: z.string().optional(),
  layout: componentApiLayoutSchema.default(DEFAULT_COMPONENT_API_LAYOUT).optional(),
  sections: componentApiSectionsSchema.optional(),
});

export const componentApiSchema = z
  .union([
    z.literal(false),
    z.object({
      heading: z.union([z.string(), z.literal(false)]).optional(),
      path: z.string().optional(),
      layout: componentApiLayoutSchema.default(DEFAULT_COMPONENT_API_LAYOUT).optional(),
      sections: componentApiSectionsSchema.optional(),
      components: z.array(componentApiComponentSchema).optional(),
    }),
  ])
  .optional();
