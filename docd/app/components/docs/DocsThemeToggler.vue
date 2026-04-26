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

  const colorMode = useColorMode();
  const buttonRef = useTemplateRef("toggler");
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

  const props = withDefaults(
    defineProps<{
      duration?: number;
    }>(),
    {
      duration: 400,
    }
  );

  const toggleTheme = () => {
    const button = buttonRef.value;
    if (!button) return;
    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(Math.max(x, viewportWidth - x), Math.max(y, viewportHeight - y));
    const newTheme = colorMode.value === "light" ? "dark" : "light";
    const applyTheme = () => {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      colorMode.preference = newTheme;
    };
    if (typeof document.startViewTransition !== "function") {
      applyTheme();
      return;
    }
    const transition = document.startViewTransition(applyTheme);
    const ready = transition?.ready;
    if (ready && typeof ready.then === "function") {
      ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`],
          },
          {
            duration: props.duration,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    }
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
</style>
