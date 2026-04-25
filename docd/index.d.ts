import type { SkillsModuleOptions } from "./modules/skills";

export interface DocdNuxtConfig {
  skills?: SkillsModuleOptions;
}

declare module "@nuxt/schema" {
  interface NuxtConfig {
    docd?: DocdNuxtConfig;
  }

  interface NuxtOptions {
    docd?: DocdNuxtConfig;
  }
}

declare module "nuxt/schema" {
  interface NuxtConfig {
    docd?: DocdNuxtConfig;
  }

  interface NuxtOptions {
    docd?: DocdNuxtConfig;
  }
}
