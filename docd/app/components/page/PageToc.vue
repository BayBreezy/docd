<template>
  <aside
    v-if="toc && toc.links && toc.links.length && !page?.hideToc"
    class="sticky top-14 z-20 hidden h-[calc(100dvh-calc(var(--header-height)+20px))] xl:block"
  >
    <UiScrollArea type="auto" class="h-full">
      <div class="flex flex-col gap-5 p-5">
        <div class="flex items-center gap-2.5 text-muted-foreground">
          <Icon :name="tocIcon" class="size-4" />
          <p class="text-sm font-semibold">{{ tocTitle }}</p>
        </div>
        <UiScrollspy smooth mode="multiple" :offset="80">
          <DocsTocRail>
            <DocsToclink :links="toc.links" />
          </DocsTocRail>
        </UiScrollspy>

        <p class="text-sm font-semibold">Extra stuff</p>
        <DocsExtraStuff />
      </div>
    </UiScrollArea>
  </aside>
</template>

<script lang="ts" setup>
  const { page } = await useDocPage();
  const { tocTitle, tocIcon } = useDocd();

  const toc = computed(() => {
    if (!page.value) return;
    return page.value?.body?.toc;
  });
</script>
