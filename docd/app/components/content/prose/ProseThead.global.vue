<template>
  <thead data-slot="prose-thead" :class="[isDashed ? 'border-dashed' : '']">
    <slot />
  </thead>
</template>

<script lang="ts" setup>
  const { isDashed } = useDocd();
</script>
