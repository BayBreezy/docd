import type { BorderType, DocdExtraLink, DocdTransitionConfig, DocLogoConfig } from "../app.config";

interface DocdUIMap {
  header: {
    title?: string;
    hideSearch?: boolean;
    logo?: DocLogoConfig;
  };
  footer?: {
    hideThemeCustomizer?: boolean;
    hideLightDarkToggle?: boolean;
  };
  toc: {
    title?: string;
    icon?: string;
  };
  borderType: BorderType;
  transition: DocdTransitionConfig;
  extraLinks: DocdExtraLink[];
}

export function useUIConfig<K extends keyof DocdUIMap>(section: K): ComputedRef<DocdUIMap[K]> {
  const appConfig = useAppConfig();
  return computed(() => {
    const ui = (appConfig.docd as { ui?: Partial<DocdUIMap> } | undefined)?.ui;
    return (ui?.[section] ?? defaultValues[section]) as DocdUIMap[K];
  });
}

const defaultValues: DocdUIMap = {
  header: {},
  toc: { title: "On this page", icon: "lucide:list" },
  borderType: "dashed",
  transition: { name: "fade", duration: 0.35, easing: "easeOut" },
  extraLinks: [],
};
