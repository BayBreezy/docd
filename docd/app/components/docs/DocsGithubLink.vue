<template>
  <NuxtLink :href="github?.repo" target="_blank" rel="noopener noreferrer">
    <UiButton class="dark:text-muted-foreground" size="icon-sm" variant="ghost">
      <Icon name="simple-icons:github" />
    </UiButton>
  </NuxtLink>
</template>

<script lang="ts" setup>
  const { github } = useDocd();
</script>
