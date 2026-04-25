<template>
  <ContextMenuTrigger data-slot="context-menu-trigger" v-bind="props">
    <slot />
  </ContextMenuTrigger>
</template>

<script lang="ts" setup>
  import { ContextMenuTrigger } from "reka-ui";
  import type { ContextMenuTriggerProps } from "reka-ui";

  const props = defineProps<ContextMenuTriggerProps>();
</script>
