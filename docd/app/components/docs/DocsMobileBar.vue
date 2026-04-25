<template>
  <div
    class="flex h-(--header-height) items-center justify-between border-b px-4 tablet:hidden"
    :class="isDashed ? 'border-dashed' : ''"
  >
    <DocsLogo />
    <div class="flex items-center gap-1">
      <DocsThemeCustomizer v-if="!hideThemeCustomizer" />
      <DocsSearchButton v-if="!hideSearch" />
      <UiButton
        variant="ghost"
        size="icon-sm"
        class="size-7"
        aria-label="Open navigation"
        @click="navOpen = true"
      >
        <Icon name="lucide:menu" class="size-4" />
      </UiButton>
    </div>
    <DocsMobileNav v-model:open="navOpen" />
  </div>
</template>

<script lang="ts" setup>
  const { isDashed, hideSearch, hideThemeCustomizer } = useDocd();
  const navOpen = ref(false);
</script>
