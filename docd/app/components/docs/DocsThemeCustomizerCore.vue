<template>
  <div>
    <DefineBgActive v-slot="{ active }">
      <AnimatePresence>
        <Motion
          v-if="active"
          class="absolute inset-0 rounded-md bg-linear-to-b from-foreground/10 via-foreground/5"
          :initial="{ opacity: 0, scaleY: 0, transformOrigin: 'top left', scaleX: 0 }"
          :animate="{ opacity: 1, scaleY: 1, scaleX: 1 }"
          :exit="{ opacity: 0, scaleY: 0, scaleX: 0 }"
          :transition="{ duration: 0.2, ease: 'easeOut' }"
        />
      </AnimatePresence>
    </DefineBgActive>

    <!-- Header -->
    <div class="grid space-y-1">
      <h1 class="text-base font-semibold text-foreground">Customize</h1>
      <p class="text-sm text-muted-foreground">Pick a style and color for your components.</p>
    </div>

    <!-- Color -->
    <div class="space-y-1.5 pt-6">
      <UiLabel class="text-sm font-semibold">Color</UiLabel>
      <RovingFocusGroup loop class="grid grid-cols-3 gap-2 py-1.5">
        <RovingFocusItem v-for="t in themes" :key="t.value" as-child>
          <UiButton
            variant="outline"
            size="sm"
            class="group relative justify-start overflow-hidden bg-transparent px-3 transition-all duration-200"
            :style="{
              borderColor: activeTheme === t.value ? 'var(--primary)' : 'var(--border)',
            }"
            @click="setTheme(t.value)"
          >
            <BgActive :active="activeTheme === t.value" />
            <span class="relative flex items-center gap-2">
              <span
                class="flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-border/60 transition-transform duration-200"
                :class="activeTheme === t.value ? 'scale-110' : 'scale-100 group-hover:scale-105'"
                :style="{ backgroundColor: t.color }"
              >
                <AnimatePresence>
                  <Motion
                    v-if="activeTheme === t.value"
                    :initial="{ scale: 0, opacity: 0 }"
                    :animate="{ scale: 1, opacity: 1 }"
                    :exit="{ scale: 0, opacity: 0 }"
                    :transition="{ duration: 0.2, delay: 0.1, ease: 'backOut' }"
                  >
                    <Icon name="lucide:check" class="size-3 text-white" />
                  </Motion>
                </AnimatePresence>
              </span>
              <span class="text-xs capitalize">{{ t.label }}</span>
            </span>
          </UiButton>
        </RovingFocusItem>
      </RovingFocusGroup>
    </div>

    <!-- Radius -->
    <div class="space-y-1.5 pt-4">
      <UiLabel class="text-sm font-semibold">Radius</UiLabel>
      <RovingFocusGroup loop class="grid grid-cols-5 gap-2 py-1.5">
        <RovingFocusItem v-for="r in radii" :key="r.value" as-child>
          <UiButton
            variant="outline"
            size="sm"
            class="group relative justify-start overflow-hidden bg-transparent px-3 transition-all duration-200"
            :style="{
              borderColor: activeRadius === r.value ? 'var(--primary)' : 'var(--border)',
            }"
            @click="setRadius(r.value)"
          >
            <BgActive :active="activeRadius === r.value" />
            <Motion
              class="relative text-xs"
              :initial="false"
              :animate="{ scale: activeRadius === r.value ? 1.05 : 1 }"
              :transition="{ duration: 0.2, ease: 'easeOut' }"
            >
              {{ r.label }}
            </Motion>
          </UiButton>
        </RovingFocusItem>
      </RovingFocusGroup>
    </div>

    <!-- Theme / Mode -->
    <div class="space-y-1.5 pt-4">
      <UiLabel class="text-sm font-semibold">Theme</UiLabel>
      <RovingFocusGroup loop class="flex space-x-2 py-1.5">
        <RovingFocusItem as-child>
          <UiButton
            variant="outline"
            size="sm"
            class="group relative justify-start overflow-hidden bg-transparent px-3 transition-all duration-200"
            :style="{
              borderColor: colorMode.value === 'light' ? 'var(--primary)' : 'var(--border)',
            }"
            @click="setMode('light')"
          >
            <BgActive :active="colorMode.value === 'light'" />
            <span class="relative flex items-center justify-center">
              <Icon name="lucide:sun" class="mr-2 size-4" />
              <span class="text-xs">Light</span>
            </span>
          </UiButton>
        </RovingFocusItem>
        <RovingFocusItem as-child>
          <UiButton
            variant="outline"
            size="sm"
            class="group relative justify-start overflow-hidden bg-transparent px-3 transition-all duration-200"
            :style="{
              borderColor: colorMode.value === 'dark' ? 'var(--primary)' : 'var(--border)',
            }"
            @click="setMode('dark')"
          >
            <BgActive :active="colorMode.value === 'dark'" />
            <span class="relative flex items-center justify-center">
              <Icon name="lucide:moon" class="mr-2 size-4" />
              <span class="text-xs">Dark</span>
            </span>
          </UiButton>
        </RovingFocusItem>
      </RovingFocusGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { RovingFocusGroup, RovingFocusItem } from "reka-ui";

  const [DefineBgActive, BgActive] = createReusableTemplate<{ active: boolean }>({
    inheritAttrs: false,
  });

  const radii = [
    { label: "0", value: "0rem" },
    { label: "0.25", value: "0.25rem" },
    { label: "0.5", value: "0.5rem" },
    { label: "0.625", value: "0.625rem" },
    { label: "0.75", value: "0.75rem" },
    { label: "1", value: "1rem" },
  ];

  const colorMode = useColorMode();

  const themes = [
    { label: "Stone", value: "theme-stone", color: "oklch(0.216 0.006 56.043)" },
    { label: "Zinc", value: "theme-zinc", color: "oklch(0.21 0.006 285.885)" },
    { label: "Neutral", value: "theme-neutral", color: "oklch(0.205 0 0)" },
    { label: "Gray", value: "theme-gray", color: "oklch(0.21 0.034 264.665)" },
    { label: "Slate", value: "theme-slate", color: "oklch(0.208 0.042 265.755)" },
    { label: "Red", value: "theme-red", color: "oklch(0.637 0.237 25.331)" },
    { label: "Rose", value: "theme-rose", color: "oklch(0.645 0.246 16.439)" },
    { label: "Orange", value: "theme-orange", color: "oklch(0.705 0.213 47.604)" },
    { label: "Green", value: "theme-green", color: "oklch(0.723 0.219 149.579)" },
    { label: "Blue", value: "theme-blue", color: "oklch(0.623 0.214 259.815)" },
    { label: "Yellow", value: "theme-yellow", color: "oklch(0.795 0.184 86.047)" },
    { label: "Violet", value: "theme-violet", color: "oklch(0.606 0.25 292.717)" },
    { label: "Nuxt", value: "theme-nuxt", color: "oklch(0.79 0.19 155.63)" },
    { label: "Mauve", value: "theme-mauve", color: "oklch(0.212 0.019 322.12)" },
    { label: "Olive", value: "theme-olive", color: "oklch(0.228 0.013 107.4)" },
    { label: "Mist", value: "theme-mist", color: "oklch(0.218 0.008 223.9)" },
    { label: "Taupe", value: "theme-taupe", color: "oklch(0.214 0.009 43.1)" },
  ];

  const THEME_KEY = "docs-color-theme";
  const RADIUS_KEY = "docs-radius";

  const activeTheme = ref("theme-zinc");
  const activeRadius = ref("0.625rem");

  onMounted(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const savedRadius = localStorage.getItem(RADIUS_KEY);
    if (savedTheme) applyTheme(savedTheme, false);
    if (savedRadius) applyRadius(savedRadius, false);
  });

  function applyTheme(value: string, save = true) {
    themes.forEach((t) => document.documentElement.classList.remove(t.value));
    document.documentElement.classList.add(value);
    activeTheme.value = value;
    if (save) localStorage.setItem(THEME_KEY, value);
  }

  function applyRadius(value: string, save = true) {
    document.documentElement.style.setProperty("--radius", value);
    activeRadius.value = value;
    if (save) localStorage.setItem(RADIUS_KEY, value);
  }

  function setTheme(value: string) {
    applyTheme(value);
  }

  function setRadius(value: string) {
    applyRadius(value);
  }

  function setMode(value: string) {
    document.documentElement.classList.toggle("dark", value === "dark");
    colorMode.preference = value;
  }
</script>
