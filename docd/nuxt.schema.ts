import { field, group } from "@nuxt/content/preview";

export default defineNuxtSchema({
  appConfig: {
    docd: group({
      title: "Docd",
      description: "Docd documentation layer configuration.",
      icon: "i-lucide-settings",
      fields: {
        github: group({
          title: "GitHub",
          description: "GitHub repository configuration for edit links.",
          icon: "i-simple-icons-github",
          fields: {
            repo: field({
              type: "string",
              title: "Repository URL",
              description: "Full GitHub repository URL, e.g. https://github.com/user/repo",
              icon: "i-simple-icons-github",
              default: "",
            }),
            branch: field({
              type: "string",
              title: "Branch",
              description: "Branch to link to for editing.",
              icon: "i-lucide-git-branch",
              default: "main",
            }),
            contentDir: field({
              type: "string",
              title: "Content Directory",
              description: "Path inside the repo where content lives.",
              icon: "i-lucide-folder",
              default: "content",
            }),
          },
        }),
        ui: group({
          title: "UI",
          description: "UI customization options.",
          icon: "i-lucide-palette",
          fields: {
            colorMode: field({
              type: "string",
              title: "Color Mode",
              description:
                "Force a specific color mode. Leave empty for system preference with toggle.",
              icon: "i-lucide-monitor",
              default: "",
              required: ["", "light", "dark"],
            }),
            borderType: field({
              type: "string",
              title: "Border Type",
              description:
                "Controls whether decorative borders and rails render as dashed or solid.",
              icon: "i-lucide-separator-horizontal",
              default: "dashed",
              required: ["dashed", "solid"],
            }),
            header: group({
              title: "Header",
              description: "Header configuration.",
              icon: "i-lucide-layout",
              fields: {
                title: field({
                  type: "string",
                  title: "Title",
                  description: "Title displayed in the header. Defaults to the site name.",
                  icon: "i-lucide-type",
                  default: "",
                }),
                hideSearch: field({
                  type: "boolean",
                  title: "Hide Search",
                  description: "Whether to hide the search button in the header.",
                  icon: "i-lucide-search",
                  default: false,
                }),
                logo: group({
                  title: "Logo",
                  description: "Logo configuration for the header.",
                  icon: "i-lucide-image",
                  fields: {
                    light: field({
                      type: "media",
                      title: "Light Mode Logo",
                      description: "Logo image for light mode.",
                      icon: "i-lucide-sun",
                      default: "",
                    }),
                    dark: field({
                      type: "media",
                      title: "Dark Mode Logo",
                      description: "Logo image for dark mode.",
                      icon: "i-lucide-moon",
                      default: "",
                    }),
                    alt: field({
                      type: "string",
                      title: "Alt Text",
                      description: "Alt text for the logo image.",
                      icon: "i-lucide-text",
                      default: "",
                    }),
                    classes: field({
                      type: "string",
                      title: "CSS Classes",
                      description: "Additional CSS classes to apply to the logo image.",
                      icon: "i-lucide-paintbrush",
                      default: "",
                    }),
                    display: field({
                      type: "string",
                      title: "Display",
                      description:
                        'Which logo variant to show in the header: "logo" or "wordmark".',
                      icon: "i-lucide-layout",
                      default: "logo",
                      required: ["logo", "wordmark"],
                    }),
                    wordmark: group({
                      title: "Wordmark",
                      description: "Wordmark image configuration for header branding.",
                      icon: "i-lucide-type",
                      fields: {
                        light: field({
                          type: "media",
                          title: "Light Mode Wordmark",
                          description: "Wordmark image for light mode.",
                          icon: "i-lucide-sun",
                          default: "",
                        }),
                        dark: field({
                          type: "media",
                          title: "Dark Mode Wordmark",
                          description: "Wordmark image for dark mode.",
                          icon: "i-lucide-moon",
                          default: "",
                        }),
                      },
                    }),
                    favicon: field({
                      type: "media",
                      title: "Favicon",
                      description: "Path to the favicon file for brand asset references.",
                      icon: "i-lucide-app-window",
                      default: "/favicon.ico",
                    }),
                    brandAssetsUrl: field({
                      type: "string",
                      title: "Brand Assets URL",
                      description: "Link to a page or folder containing brand assets.",
                      icon: "i-lucide-palette",
                      default: "",
                    }),
                    url: field({
                      type: "string",
                      title: "Click URL",
                      description: "URL to navigate to when the logo is clicked.",
                      icon: "i-lucide-link",
                      default: "/",
                    }),
                  },
                }),
              },
            }),
            toc: group({
              title: "Table of Contents",
              description: "Table of contents sidebar configuration.",
              icon: "i-lucide-list",
              fields: {
                title: field({
                  type: "string",
                  title: "Title",
                  description: "Title displayed at the top of the ToC.",
                  icon: "i-lucide-heading",
                  default: "On this page",
                }),
                icon: field({
                  type: "icon",
                  title: "Icon",
                  description: "Icon displayed next to the ToC title.",
                  icon: "i-lucide-list",
                  default: "lucide:list",
                }),
              },
            }),
            transition: group({
              title: "Page Transition",
              description: "Page transition animation configuration.",
              icon: "i-lucide-sparkles",
              fields: {
                name: field({
                  type: "string",
                  title: "Transition Name",
                  description: 'Transition preset to use. Set to "none" to disable.',
                  icon: "i-lucide-play",
                  default: "fade",
                  required: [
                    "none",
                    "fade",
                    "rightToLeft",
                    "leftToRight",
                    "upToDown",
                    "downToUp",
                    "zoom",
                    "cupertino",
                  ],
                }),
                duration: field({
                  type: "number",
                  title: "Duration",
                  description: "Transition duration in seconds.",
                  icon: "i-lucide-timer",
                  default: 0.35,
                }),
                easing: field({
                  type: "string",
                  title: "Easing",
                  description: "Easing function for the transition.",
                  icon: "i-lucide-activity",
                  default: "easeOut",
                }),
              },
            }),
            footer: group({
              title: "Footer",
              description: "Sidebar footer configuration.",
              icon: "i-lucide-layout",
              fields: {
                hideThemeCustomizer: field({
                  type: "boolean",
                  title: "Hide Theme Customizer",
                  description: "Whether to hide the theme customizer in the sidebar footer.",
                  icon: "i-lucide-palette",
                  default: false,
                }),
                hideLightDarkToggle: field({
                  type: "boolean",
                  title: "Hide Light/Dark Toggle",
                  description: "Whether to hide the light/dark mode toggle in the sidebar footer.",
                  icon: "i-lucide-moon",
                  default: false,
                }),
              },
            }),
            extraLinks: field({
              type: "array",
              title: "Extra Links",
              description: "Additional links rendered in the sidebar's extra section.",
              icon: "i-lucide-link",
              default: [],
            }),
          },
        }),
      },
    }),
    seo: group({
      title: "SEO",
      description: "SEO configuration.",
      icon: "i-lucide-search",
      fields: {
        titleTemplate: field({
          type: "string",
          title: "Title Template",
          description: "Template for page titles. Use %s as the page title placeholder.",
          icon: "i-lucide-type",
          default: "%s",
        }),
        title: field({
          type: "string",
          title: "Site Title",
          description: "Default site title.",
          icon: "i-lucide-type",
          default: "",
        }),
        description: field({
          type: "string",
          title: "Description",
          description: "Default site description.",
          icon: "i-lucide-text",
          default: "",
        }),
      },
    }),
  },
});
