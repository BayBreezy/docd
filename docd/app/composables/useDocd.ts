import type { DocdConfig, DocdGithubConfig } from "../app.config";
import {
  ANIMATE_IDENTITY,
  transitionPresets,
  type DocdTransitionName,
  type TransitionStates,
} from "../transitions/presets";

export function useDocd() {
  const appConfig = useAppConfig();
  const route = useRoute();
  const direction = useState<"forward" | "back">("nav-direction", () => "forward");

  /* =====================================
  =               UI                     =
  ===================================== */
  const borderType = useUIConfig("borderType");
  const isDashed = computed(() => borderType.value === "dashed");
  const extraLinks = useUIConfig("extraLinks");
  const github = computed(
    () => ((appConfig.docd as DocdConfig | undefined)?.github ?? {}) as DocdGithubConfig
  );

  /* =====================================
  =               Footer                 =
  ===================================== */
  const footer = useUIConfig("footer");
  const hideThemeCustomizer = computed(() => footer.value?.hideThemeCustomizer ?? false);
  const hideLightDarkToggle = computed(() => footer.value?.hideLightDarkToggle ?? false);

  /* =====================================
  =               Header                 =
  ===================================== */
  const header = useUIConfig("header");
  const headerTitle = computed(() => header.value.title ?? "");
  const hideSearch = computed(() => header.value.hideSearch ?? false);

  /* =====================================
  =               Logo                   =
  ===================================== */
  const logo = computed(() => header.value.logo);
  const lightLogo = computed(() => logo.value?.light);
  const darkLogo = computed(() => logo.value?.dark);
  const logoAlt = computed(() => logo.value?.alt ?? "Logo");
  const logoClasses = computed(() => logo.value?.classes ?? "");
  const logoUrl = computed(() => logo.value?.url ?? "/");

  /* =====================================
  =               ToC                    =
  ===================================== */
  const toc = useUIConfig("toc");
  const tocTitle = computed(() => toc.value.title ?? "On this page");
  const tocIcon = computed(() => toc.value.icon ?? "lucide:list");

  /* =====================================
  =               Transition             =
  ===================================== */
  const transitionConfig = useUIConfig("transition");

  const pageMeta = computed(() => route.meta?.pageTransition as DocdTransitionName | undefined);

  const activeName = computed<DocdTransitionName>(
    () => pageMeta.value ?? (transitionConfig.value.name as DocdTransitionName) ?? "fade"
  );

  const preset = computed<TransitionStates>(() => {
    const base = transitionPresets[activeName.value] ?? transitionPresets.rightToLeft;
    if (direction.value === "back") {
      return { initial: base.exit, exit: base.initial };
    }
    return base;
  });

  const duration = computed(() => transitionConfig.value.duration ?? 0.35);
  const easing = computed(() => transitionConfig.value.easing ?? "easeOut");

  return {
    // ui
    header,
    headerTitle,
    borderType,
    isDashed,
    extraLinks,
    github,
    hideSearch,
    // transition
    activeName,
    preset,
    animate: ANIMATE_IDENTITY,
    duration,
    easing,
    // logo
    logo,
    lightLogo,
    darkLogo,
    logoAlt,
    logoClasses,
    logoUrl,
    // ToC
    toc,
    tocTitle,
    tocIcon,
    // footer
    hideThemeCustomizer,
    hideLightDarkToggle,
  };
}
