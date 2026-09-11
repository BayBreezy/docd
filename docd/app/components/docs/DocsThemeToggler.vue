<template>
  <UiTooltip>
    <UiTooltipTrigger as-child>
      <button
        ref="toggler"
        :class="
          buttonStyles({
            variant: 'ghost',
            size: 'icon-sm',
          })
        "
        @click="toggleTheme"
      >
        <ClientOnly>
          <template #fallback>
            <Icon name="lucide:sun-medium" />
          </template>
          <Icon :name="iconName" />
        </ClientOnly>
      </button>
    </UiTooltipTrigger>
    <UiTooltipContent> Toggle theme </UiTooltipContent>
  </UiTooltip>
</template>
<script lang="ts" setup>
  import { buttonStyles } from "../Ui/Button.vue";

  type ThemeTransitionVariant =
    | "circle"
    | "square"
    | "triangle"
    | "diamond"
    | "hexagon"
    | "rectangle"
    | "star";

  const props = withDefaults(
    defineProps<{
      duration?: number;
      variant?: ThemeTransitionVariant;
      /** When true, the transition expands from the viewport center instead of the button center. */
      fromCenter?: boolean;
    }>(),
    {
      duration: 400,
      variant: "circle",
      fromCenter: false,
    }
  );

  const colorMode = useColorMode();
  const toggler = useTemplateRef("toggler");
  const { width: viewportWidthRef, height: viewportHeightRef } = useWindowSize();

  const iconName = computed(() => {
    switch (colorMode.value) {
      case "light":
        return "lucide:sun-medium";
      case "dark":
        return "lucide:moon";
      default:
        return "lucide:sun-medium";
    }
  });

  // CSS custom properties driving the ::view-transition-group/new(root) rules below.
  const vtDuration = useCssVar("--theme-toggle-vt-duration");
  const vtClipFrom = useCssVar("--theme-vt-clip-from");

  let isTransitioning = false;
  let activeAnimation: Animation | null = null;

  function cancelAnimation() {
    activeAnimation?.cancel();
    activeAnimation = null;
  }

  function resetTransitionState() {
    isTransitioning = false;
    delete document.documentElement.dataset.themeVt;
    vtDuration.value = null;
    vtClipFrom.value = null;
    cancelAnimation();
  }

  tryOnScopeDispose(() => {
    cancelAnimation();
    if (document.documentElement.dataset.themeVt !== "active") return;
    delete document.documentElement.dataset.themeVt;
    vtDuration.value = null;
    vtClipFrom.value = null;
  });

  function polygonCollapsed(point: string, vertexCount: number): string {
    return `polygon(${Array.from({ length: vertexCount }, () => point).join(", ")})`;
  }

  // All coordinates are percentages of the snapshot reference box: Chrome renders absolute px
  // clip-path coordinates on ::view-transition-new(root) unscaled on fractional display scales
  // for the first transition after load, so px values land at the wrong position.
  function getThemeTransitionClipPaths(
    variant: ThemeTransitionVariant,
    cx: number,
    cy: number,
    maxRadius: number,
    viewportWidth: number,
    viewportHeight: number
  ): [string, string] {
    const toX = (x: number) => `${(x / viewportWidth) * 100}%`;
    const toY = (y: number) => `${(y / viewportHeight) * 100}%`;
    const point = (x: number, y: number) => `${toX(x)} ${toY(y)}`;
    // circle() percentage radii resolve against hypot(w, h) / sqrt(2) of the reference box.
    const toRadius = (r: number) =>
      `${(r / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100}%`;

    switch (variant) {
      case "circle":
        return [
          `circle(0% at ${point(cx, cy)})`,
          `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`,
        ];
      case "square": {
        const halfW = Math.max(cx, viewportWidth - cx);
        const halfH = Math.max(cy, viewportHeight - cy);
        const halfSide = Math.max(halfW, halfH) * 1.05;
        const end = [
          point(cx - halfSide, cy - halfSide),
          point(cx + halfSide, cy - halfSide),
          point(cx + halfSide, cy + halfSide),
          point(cx - halfSide, cy + halfSide),
        ].join(", ");
        return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
      }
      case "triangle": {
        const scale = maxRadius * 2.2;
        const dx = (Math.sqrt(3) / 2) * scale;
        const verts = [
          point(cx, cy - scale),
          point(cx + dx, cy + 0.5 * scale),
          point(cx - dx, cy + 0.5 * scale),
        ].join(", ");
        return [polygonCollapsed(point(cx, cy), 3), `polygon(${verts})`];
      }
      case "diamond": {
        // Slightly larger than the view-transition circle radius so axis-aligned coverage matches the circle reveal.
        const R = maxRadius * Math.SQRT2;
        const end = [
          point(cx, cy - R),
          point(cx + R, cy),
          point(cx, cy + R),
          point(cx - R, cy),
        ].join(", ");
        return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
      }
      case "hexagon": {
        const R = maxRadius * Math.SQRT2;
        const verts: string[] = [];
        for (let i = 0; i < 6; i++) {
          const a = -Math.PI / 2 + (i * Math.PI) / 3;
          verts.push(point(cx + R * Math.cos(a), cy + R * Math.sin(a)));
        }
        return [polygonCollapsed(point(cx, cy), 6), `polygon(${verts.join(", ")})`];
      }
      case "rectangle": {
        const halfW = Math.max(cx, viewportWidth - cx);
        const halfH = Math.max(cy, viewportHeight - cy);
        const end = [
          point(cx - halfW, cy - halfH),
          point(cx + halfW, cy - halfH),
          point(cx + halfW, cy + halfH),
          point(cx - halfW, cy + halfH),
        ].join(", ");
        return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
      }
      case "star": {
        // Small overscan so the last frames never leave a 1px seam before the transition group ends.
        const R = maxRadius * Math.SQRT2 * 1.03;
        const innerRatio = 0.42;
        const starPolygon = (radius: number) => {
          const verts: string[] = [];
          for (let i = 0; i < 5; i++) {
            const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
            verts.push(point(cx + radius * Math.cos(outerA), cy + radius * Math.sin(outerA)));
            const innerA = outerA + Math.PI / 5;
            verts.push(
              point(
                cx + radius * innerRatio * Math.cos(innerA),
                cy + radius * innerRatio * Math.sin(innerA)
              )
            );
          }
          return `polygon(${verts.join(", ")})`;
        };
        const startR = Math.max(2, R * 0.025);
        return [starPolygon(startR), starPolygon(R)];
      }
      default:
        return [
          `circle(0% at ${point(cx, cy)})`,
          `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`,
        ];
    }
  }

  const toggleTheme = () => {
    const button = toggler.value;
    if (!button || isTransitioning || document.documentElement.dataset.themeVt === "active") return;

    // innerWidth/innerHeight (not visualViewport): percentages must resolve against the
    // snapshot reference box, which includes classic scrollbars.
    const viewportWidth = viewportWidthRef.value;
    const viewportHeight = viewportHeightRef.value;

    let x: number;
    let y: number;
    if (props.fromCenter) {
      x = viewportWidth / 2;
      y = viewportHeight / 2;
    } else {
      const { top, left, width, height } = button.getBoundingClientRect();
      x = left + width / 2;
      y = top + height / 2;
    }

    const maxRadius = Math.hypot(Math.max(x, viewportWidth - x), Math.max(y, viewportHeight - y));

    const newTheme = colorMode.value === "dark" ? "light" : "dark";
    const applyTheme = () => {
      // Toggle the class synchronously so the View Transitions API snapshots the new theme
      // inside the startViewTransition callback, then hand persistence to color-mode.
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      document.documentElement.classList.toggle("light", newTheme === "light");
      colorMode.preference = newTheme;
    };

    if (typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }

    const clipPath = getThemeTransitionClipPaths(
      props.variant,
      x,
      y,
      maxRadius,
      viewportWidth,
      viewportHeight
    );

    document.documentElement.dataset.themeVt = "active";
    vtDuration.value = `${props.duration}ms`;
    // Pin the collapsed clip-path via CSS so Firefox does not paint the new theme unclipped
    // between snapshot and the ready.then() JS animation.
    vtClipFrom.value = clipPath[0];

    isTransitioning = true;
    const transition = document.startViewTransition(applyTheme);
    transition.finished.finally(resetTransitionState).catch(() => {});

    transition.ready
      .then(() => {
        activeAnimation = document.documentElement.animate(
          { clipPath },
          {
            duration: props.duration,
            // Star: linear avoids easing overshoot that fights polygon interpolation at t→1.
            easing: props.variant === "star" ? "linear" : "ease-in-out",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});
  };
</script>
<style>
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }
  ::view-transition-new(root) {
    z-index: 9999;
  }
  ::view-transition-old(root) {
    z-index: 1;
  }
  html[data-theme-vt="active"]::view-transition-group(root) {
    animation-duration: var(--theme-toggle-vt-duration, 400ms);
  }
  html[data-theme-vt="active"]::view-transition-new(root) {
    clip-path: var(--theme-vt-clip-from);
  }
</style>
