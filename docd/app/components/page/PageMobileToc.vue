<template>
  <div v-if="hasToc" class="sticky top-[calc(var(--header-height))] z-40 xl:hidden">
    <!-- Always-mounted hidden container — keeps scrollspy alive regardless of popover state -->
    <div
      ref="spyRoot"
      aria-hidden="true"
      class="pointer-events-none absolute size-0 overflow-hidden opacity-0"
    >
      <DocsToclink :links="toc!.links" />
    </div>

    <UiPopover v-model:open="isOpen">
      <UiPopoverTrigger as-child>
        <button
          class="flex w-full cursor-pointer items-center gap-2.5 border-b bg-background/95 px-4 backdrop-blur-sm transition-colors hover:bg-muted/50"
          :class="isDashed ? 'border-dashed' : ''"
          style="height: 2.5rem"
        >
          <!-- Scroll progress ring -->
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            class="shrink-0 -rotate-90"
            aria-hidden="true"
          >
            <circle
              cx="9"
              cy="9"
              r="7"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-border"
            />
            <circle
              cx="9"
              cy="9"
              r="7"
              fill="none"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="circumference - scrollProgress * circumference"
              stroke-width="2"
              stroke-linecap="round"
              stroke="currentColor"
              class="text-primary transition-[stroke-dashoffset] duration-150 ease-out"
            />
          </svg>

          <span class="flex-1 truncate text-left text-sm">
            <span v-if="activeHeadingText" class="font-medium text-foreground">
              {{ activeHeadingText }}
            </span>
            <span v-else class="text-muted-foreground">On this page</span>
          </span>

          <Icon
            name="lucide:chevron-down"
            class="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
          />
        </button>
      </UiPopoverTrigger>

      <UiPopoverContent
        align="start"
        side="bottom"
        :side-offset="0"
        :collision-padding="0"
        :avoid-collisions="false"
        class="w-(--reka-popover-trigger-width) rounded-none border-x-0 border-t-0 p-0 shadow-sm"
        translucent
        :class="isDashed ? 'border-dashed' : ''"
      >
        <!-- Intercept link clicks to close the popover -->
        <div @click.capture="onContentClick">
          <UiScrollArea>
            <div class="max-h-[50dvh] p-4">
              <UiScrollspy smooth mode="multiple" :offset="120">
                <DocsTocRail>
                  <DocsToclink :links="toc!.links" />
                </DocsTocRail>
              </UiScrollspy>
            </div>
          </UiScrollArea>
        </div>
      </UiPopoverContent>
    </UiPopover>
  </div>
</template>

<script lang="ts" setup>
  type TocLink = {
    text: string;
    id: string;
    depth: number;
    children?: TocLink[];
  };

  const { page } = await useDocPage();
  const { isDashed } = useDocd();

  const toc = computed(() => page.value?.body?.toc as { links: TocLink[] } | undefined);
  const hasToc = computed(() => !!toc.value?.links?.length && !page.value?.hideToc);

  // --- Hidden, always-mounted scrollspy root so activeId persists when popover is closed ---
  const spyRoot = ref<HTMLElement | null>(null);
  const { activeId } = useScrollspy({ root: spyRoot, offset: 120, history: false, mode: "single" });

  // Flatten toc links for lookup
  function flattenLinks(links: TocLink[]): TocLink[] {
    return links.flatMap((l) => [l, ...(l.children ? flattenLinks(l.children) : [])]);
  }

  const activeHeadingText = computed(() => {
    if (!toc.value?.links) return null;
    const flat = flattenLinks(toc.value.links);
    // Fall back to the first heading when the scrollspy hasn't fired yet
    // (hard reload at top of page, or immediately after navigation).
    const id = activeId.value ?? flat[0]?.id;
    return flat.find((l) => l.id === id)?.text ?? null;
  });

  // --- Scroll progress ---
  const scrollProgress = ref(0);
  const circumference = 2 * Math.PI * 7;

  if (import.meta.client) {
    const updateProgress = () => {
      const docH = document.documentElement.scrollHeight;
      const winH = window.innerHeight;
      const max = docH - winH;
      scrollProgress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };

    useEventListener(window, "scroll", updateProgress, { passive: true });
    onMounted(updateProgress);
  }

  // --- Popover state ---
  const isOpen = ref(false);

  // Reset on navigation
  const route = useRoute();
  watch(
    () => route.path,
    () => {
      isOpen.value = false;
      scrollProgress.value = 0;
    }
  );

  function onContentClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (target.closest("a")) {
      isOpen.value = false;
    }
  }
</script>
