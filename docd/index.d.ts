import type { CssModuleOptions } from "./modules/css";
import type { SkillsModuleOptions } from "./modules/skills";

export interface DocdNuxtConfig {
  skills?: SkillsModuleOptions;
  css?: CssModuleOptions;
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
