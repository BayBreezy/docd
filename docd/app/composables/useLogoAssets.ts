import type { DocLogoConfig } from "../app.config";

type DocdLogoAction = {
  label: string;
  icon: string;
  action: () => void | Promise<void>;
};

function isSvgUrl(url: string): boolean {
  return url.toLowerCase().endsWith(".svg");
}

function getExtension(url: string): string {
  const match = url.match(/\.([a-z0-9]+)(?:\?|$)/i);
  return match?.[1] ? `.${match[1].toLowerCase()}` : ".png";
}

function normalizeSvg(svg: string, name: string): string {
  let result = svg.replace(
    /fill="(black|white|#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))"/g,
    'fill="currentColor"'
  );

  if (name) {
    result = result.replace(/<svg\b/, `<svg id="${name}"`);
    result = result.replace(/(<svg[^>]*>)/, `$1<title>${name}</title>`);
  }

  return result;
}

async function fetchSvgContent(url: string, name: string): Promise<string | null> {
  try {
    const absoluteUrl = new URL(url, window.location.origin).href;
    const response = await fetch(absoluteUrl);
    if (!response.ok) return null;
    const text = await response.text();
    return normalizeSvg(text, name);
  } catch {
    return null;
  }
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function triggerLinkDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function useLogoAssets() {
  const appConfig = useAppConfig();
  const colorMode = useColorMode() as { value: string; forced?: boolean };

  const header = computed(
    () =>
      (appConfig.docd as { ui?: { header?: { title?: string; logo?: DocLogoConfig } } } | undefined)
        ?.ui?.header
  );
  const logo = computed(() => header.value?.logo);

  const hasLogo = computed(() => !!(logo.value?.light || logo.value?.dark));
  const hasWordmark = computed(() => !!(logo.value?.wordmark?.light || logo.value?.wordmark?.dark));
  const hasDisplayAsset = computed(() => hasLogo.value || hasWordmark.value);

  const displayMode = computed(() => logo.value?.display ?? "logo");
  const isWordmarkDisplay = computed(() => displayMode.value === "wordmark" && hasWordmark.value);

  const currentLogoUrl = computed(() => {
    if (!logo.value) return "";
    if (colorMode.value === "dark") return logo.value.dark || logo.value.light || "";
    return logo.value.light || logo.value.dark || "";
  });

  const currentWordmarkUrl = computed(() => {
    if (!logo.value?.wordmark) return "";
    if (colorMode.value === "dark")
      return logo.value.wordmark.dark || logo.value.wordmark.light || "";
    return logo.value.wordmark.light || logo.value.wordmark.dark || "";
  });

  const headerLightUrl = computed(() => {
    if (!logo.value) return "";
    if (isWordmarkDisplay.value) {
      return (
        logo.value.wordmark?.light ||
        logo.value.wordmark?.dark ||
        logo.value.light ||
        logo.value.dark ||
        ""
      );
    }
    return logo.value.light || logo.value.dark || "";
  });

  const headerDarkUrl = computed(() => {
    if (!logo.value) return "";
    if (isWordmarkDisplay.value) {
      return (
        logo.value.wordmark?.dark ||
        logo.value.wordmark?.light ||
        logo.value.dark ||
        logo.value.light ||
        ""
      );
    }
    return logo.value.dark || logo.value.light || "";
  });

  const activeDisplayUrl = computed(() =>
    colorMode.value === "dark"
      ? headerDarkUrl.value || headerLightUrl.value
      : headerLightUrl.value || headerDarkUrl.value
  );

  const faviconUrl = computed(() => logo.value?.favicon || "/favicon.ico");
  const logoAlt = computed(() => logo.value?.alt || header.value?.title || "Logo");
  const logoClasses = computed(() => logo.value?.classes || "");

  const brandName = computed(() => header.value?.title || logoAlt.value || "logo");
  const prefix = computed(() => brandName.value.toLowerCase().replace(/\s+/g, "-"));
  const logoName = computed(() => `${brandName.value} Logo`);
  const wordmarkName = computed(() => `${brandName.value} Wordmark`);

  const logoIsSvg = computed(() => isSvgUrl(currentLogoUrl.value));
  const wordmarkIsSvg = computed(() => isSvgUrl(currentWordmarkUrl.value));
  const brandAssetsUrl = computed(() => logo.value?.brandAssetsUrl || "");

  async function copyLogo() {
    if (!currentLogoUrl.value || !logoIsSvg.value) return;
    const svg = await fetchSvgContent(currentLogoUrl.value, logoName.value);
    if (!svg) {
      useSonner.error("Logo copy failed", {
        description: "The active logo could not be copied.",
      });
      return;
    }

    const ok = await copyTextToClipboard(svg);
    if (ok) {
      useSonner.success("Logo copied", {
        description: "The active logo SVG has been copied to your clipboard.",
      });
      return;
    }

    useSonner.error("Logo copy failed", {
      description: "Clipboard access was denied.",
    });
  }

  async function copyWordmark() {
    if (!currentWordmarkUrl.value || !wordmarkIsSvg.value) return;
    const svg = await fetchSvgContent(currentWordmarkUrl.value, wordmarkName.value);
    if (!svg) {
      useSonner.error("Wordmark copy failed", {
        description: "The active wordmark could not be copied.",
      });
      return;
    }

    const ok = await copyTextToClipboard(svg);
    if (ok) {
      useSonner.success("Wordmark copied", {
        description: "The active wordmark SVG has been copied to your clipboard.",
      });
      return;
    }

    useSonner.error("Wordmark copy failed", {
      description: "Clipboard access was denied.",
    });
  }

  async function downloadLogo() {
    if (!currentLogoUrl.value) return;

    if (logoIsSvg.value) {
      const svg = await fetchSvgContent(currentLogoUrl.value, logoName.value);
      if (!svg) {
        useSonner.error("Logo download failed", {
          description: "The active logo SVG could not be downloaded.",
        });
        return;
      }

      triggerDownload(new Blob([svg], { type: "image/svg+xml" }), `${prefix.value}-logo.svg`);
    } else {
      triggerLinkDownload(
        currentLogoUrl.value,
        `${prefix.value}-logo${getExtension(currentLogoUrl.value)}`
      );
    }

    useSonner.success("Logo downloaded", {
      description: "The active logo asset has been downloaded.",
    });
  }

  async function downloadWordmark() {
    if (!currentWordmarkUrl.value) return;

    if (wordmarkIsSvg.value) {
      const svg = await fetchSvgContent(currentWordmarkUrl.value, wordmarkName.value);
      if (!svg) {
        useSonner.error("Wordmark download failed", {
          description: "The active wordmark SVG could not be downloaded.",
        });
        return;
      }

      triggerDownload(new Blob([svg], { type: "image/svg+xml" }), `${prefix.value}-wordmark.svg`);
    } else {
      triggerLinkDownload(
        currentWordmarkUrl.value,
        `${prefix.value}-wordmark${getExtension(currentWordmarkUrl.value)}`
      );
    }

    useSonner.success("Wordmark downloaded", {
      description: "The active wordmark asset has been downloaded.",
    });
  }

  const contextMenuItems = computed<DocdLogoAction[][]>(() => {
    const groups: DocdLogoAction[][] = [];
    const copyGroup: DocdLogoAction[] = [];
    const downloadGroup: DocdLogoAction[] = [];

    if (currentLogoUrl.value && logoIsSvg.value) {
      copyGroup.push({
        label: "Copy logo SVG",
        icon: "lucide:copy",
        action: copyLogo,
      });
    }

    if (currentWordmarkUrl.value && wordmarkIsSvg.value) {
      copyGroup.push({
        label: "Copy wordmark SVG",
        icon: "lucide:copy",
        action: copyWordmark,
      });
    }

    if (currentLogoUrl.value) {
      downloadGroup.push({
        label: "Download logo",
        icon: "lucide:download",
        action: downloadLogo,
      });
    }

    if (currentWordmarkUrl.value) {
      downloadGroup.push({
        label: "Download wordmark",
        icon: "lucide:download",
        action: downloadWordmark,
      });
    }

    if (copyGroup.length) groups.push(copyGroup);
    if (downloadGroup.length) groups.push(downloadGroup);

    if (brandAssetsUrl.value) {
      groups.push([
        {
          label: "View brand assets",
          icon: "lucide:palette",
          action: () => {
            window.open(brandAssetsUrl.value, "_blank", "noopener,noreferrer");
          },
        },
      ]);
    }

    return groups;
  });

  return {
    hasLogo,
    hasWordmark,
    hasDisplayAsset,
    displayMode,
    isWordmarkDisplay,
    currentLogoUrl,
    currentWordmarkUrl,
    activeDisplayUrl,
    headerLightUrl,
    headerDarkUrl,
    faviconUrl,
    logoAlt,
    logoClasses,
    contextMenuItems,
    actionGroups: contextMenuItems,
  };
}
