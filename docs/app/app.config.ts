const repoBase = "https://github.com/BayBreezy/docd";

export default defineAppConfig({
  docd: {
    github: {
      repo: repoBase,
      branch: "main",
      contentDir: "docs/content",
    },
    ui: {
      borderType: "dashed",
      header: {
        title: "Docd",
        logo: {
          alt: "Docd Logo",
          light: "/logos/docd-logo-dark.svg",
          dark: "/logos/docd-logo-light.svg",
          favicon: "/favicon.svg",
        },
      },
      extraLinks: [
        { icon: "lucide:star", label: "Star on GitHub", external: true, href: repoBase },
        {
          icon: "lucide:bug",
          label: "Report an issue",
          external: true,
          href: `${repoBase}/issues/new?template=bug_report.yml`,
        },
        {
          icon: "lucide:lightbulb",
          label: "Feature request",
          external: true,
          href: `${repoBase}/issues/new?template=feature_request.yml`,
        },
        {
          icon: "lucide:coffee",
          label: "Buy me coffee",
          external: true,
          href: "https://buymeacoffee.com/llehXIrI8g",
        },
      ],
      transition: {
        name: "fade",
      },
    },
  },
});
