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
          href: `${repoBase}/issues/new`,
        },
      ],
      transition: {
        name: "fade",
      },
    },
  },
});
