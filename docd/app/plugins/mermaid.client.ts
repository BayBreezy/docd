import mermaid from "mermaid";
import type { MermaidConfig } from "mermaid";

export default defineNuxtPlugin(() => {
  /**
   * Mermaid initialization configuration
   */
  const mermaidInitConfig = {
    startOnLoad: false,
    themeVariables: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
    },
    flowchart: {
      curve: "basis",
      useMaxWidth: true,
    },
    sequence: {
      actorMargin: 50,
      showSequenceNumbers: false,
    },
    suppressErrorRendering: true,
  } as MermaidConfig;
  /**
   * Initialize Mermaid with the specified configuration
   */
  mermaid.initialize(mermaidInitConfig);

  return {
    provide: {
      mermaidInstance: mermaid,
      mermaidInitConfig,
    },
  };
});
