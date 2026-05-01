import type { DocdTransitionName } from "./transitions/presets";

export type BorderType = "dashed" | "solid";

export type DocLogoWordmarkConfig = {
  /**
   * URL of the wordmark image to be used in light mode.
   */
  light?: string;
  /**
   * URL of the wordmark image to be used in dark mode.
   */
  dark?: string;
};

export type DocdGithubConfig = {
  /** Full GitHub repo URL, e.g. "https://github.com/user/repo" */
  repo: string;
  /** Branch to link to for editing.
   *
   * @default "main"
   */
  branch?: string;
  /** Path inside the repo where content lives.
   *
   * @default "content"
   */
  contentDir?: string;
};

export type DocdExtraLink = {
  /**
   * Icon to be displayed for this link. Should be a valid icon name from [Icônes](https://icones.js.org/)
   */
  icon?: string;
  /**
   *  Text to be displayed for this link.
   */
  label: string;
  /**
   * URL this link should point to.
   *
   * Can be internal or external. If external, the link will open in a new tab.
   */
  href: string;
  /**
   * Whether this is an external link.
   *
   * If `true`, the link will open in a new tab.
   *
   * If `false` or omitted, the link will be treated as internal and use NuxtLink for navigation.
   */
  external?: boolean;
};

export type DocdTransitionConfig = {
  /**
   * Name of the transition preset to use. Set to `"none"` to disable transitions entirely.
   *
   * @default "fade"
   */
  name?: DocdTransitionName;
  /**
   * Duration of the transition in seconds.
   *
   * @default 0.35
   */
  duration?: number;
  /**
   * Easing function to use for the transition.
   *
   * @default "easeOut"
   */
  easing?: string;
};

/**
 * Configuration for the logo used in the header.
 */
export type DocLogoConfig = {
  /**
   * URL of the logo image to be used in light mode.
   */
  light?: string;
  /**
   * URL of the logo image to be used in dark mode.
   */
  dark?: string;
  /**
   * Alt text for the logo image.
   */
  alt?: string;
  /**
   * Additional CSS classes to apply to the logo image.
   */
  classes?: string;
  /**
   * Which logo variant to render in the header.
   *
   * @default "logo"
   */
  display?: "logo" | "wordmark";
  /**
   * Optional wordmark assets for text-style branding.
   */
  wordmark?: DocLogoWordmarkConfig;
  /**
   * Favicon path for brand asset references.
   *
   * @default "/favicon.ico"
   */
  favicon?: string;
  /**
   * URL to a page or folder containing brand assets.
   */
  brandAssetsUrl?: string;
  /**
   * URL to navigate to when the logo is clicked. If not provided, clicking the logo will navigate to the homepage ("/").
   *
   * @default "/"
   */
  url?: string;
};

/**
 * Configuration for Docd, the documentation layer built with [UI Thing](https://uithing.com).
 */
export type DocdConfig = {
  /** GitHub repository info used to generate the "`Edit this page`" link.
   *
   * Inferred from environment variables or local .git config if not provided, but can be set here explicitly if needed.
   */
  github?: DocdGithubConfig;
  /**
   * UI-related configuration options for Docd.
   */
  ui?: {
    /**
     * Header-related UI configuration options.
     */
    header?: {
      /** Title to be displayed in the header.
       *
       * Default: site name (inferred from package.json or Git info)
       */
      title?: string;
      /**
       * Whether to hide the search button in the sidebar's header.
       *
       * @default false
       */
      hideSearch?: boolean;
      /** Logo configuration for the header. */
      logo?: DocLogoConfig;
    };
    footer?: {
      /**
       * Whether to hide the theme customizer in the sidebar
       *
       * @default false
       */
      hideThemeCustomizer?: boolean;
      /**
       * Whether to hide the light/dark mode toggle in the sidebar.
       *
       * @default false
       */
      hideLightDarkToggle?: boolean;
    };
    /**
     * Configuration for the table of contents (ToC) sidebar. If not provided, the ToC will still render but with default settings.
     */
    toc?: {
      /**
       * Title to be displayed at the top of the ToC sidebar.
       *
       * @default "On this page"
       */
      title?: string;
      /**
       * Icon to be displayed next to the ToC title. Should be a valid icon name from [Icônes](https://icones.js.org/).
       *
       * @default "lucide:list"
       */
      icon?: string;
    };
    /**
     * Controls whether borders and decorative rails render as dashed or solid.
     *
     * @default "dashed"
     */
    borderType?: BorderType;
    /**
     * Links rendered in the sidebar's "extra stuff" section.
     *
     * The edit this page link is rendered here automatically if the `github` config is provided.
     *
     * You can add any additional links you want here as well.
     */
    extraLinks?: DocdExtraLink[];
    /**
     * The color mode to use for the site by default.
     */
    colorMode?: "light" | "dark";
    /**
     * Controls which collapsible sections in the navigation sidebar are expanded by default.
     *
     * - `true`: expand all collapsibles at every depth
     * - `number`: expand all collapsibles up to and including this depth level (1 = top-level only)
     * - `number[]`: expand collapsibles at exactly these depth levels
     */
    expandNav?: true | number | number[];
    /**
     * Page transition configuration. Set `name` to `"none"` to disable transitions entirely.
     *
     * @default {
     *   name: "fade",
     *   duration: 0.35,
     *   easing: "easeOut",
     * }
     */
    transition?: DocdTransitionConfig;
  };
};

export default defineAppConfig({
  docd: {
    ui: {
      toc: { title: "On this page", icon: "lucide:list" },
      borderType: "dashed",
      transition: {
        name: "fade",
        duration: 0.35,
        easing: "easeOut",
      },
    },
  },
});

declare module "@nuxt/schema" {
  interface AppConfigInput {
    /**
     * Configuration for Docd, the documentation layer built with [UI Thing](https://uithing.com).
     */
    docd?: DocdConfig;
  }
}
