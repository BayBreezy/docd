<template>
  <UiTooltip>
    <UiTooltipTrigger as-child>
      <UiButton
        size="icon-sm"
        variant="ghost"
        class="size-7"
        @click="searchModal = true"
        title="Search documentation"
      >
        <Icon name="lucide:search" />
      </UiButton>
    </UiTooltipTrigger>
    <UiTooltipContent> Click to search </UiTooltipContent>
  </UiTooltip>
</template>

<script lang="ts" setup>
  const searchModal = useSearchModal();
</script>
