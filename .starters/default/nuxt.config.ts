export default defineNuxtConfig({
  extends: ["docd"],
  llms: {
    domain: "http://localhost:3000",
    title: "My Docd Site",
    description: "A starter documentation site powered by Docd.",
    full: {
      title: "My Docd Site",
      description: "A starter documentation site powered by Docd.",
    },
  },
});
