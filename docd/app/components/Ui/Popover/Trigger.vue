<template>
  <PopoverTrigger data-slot="popover-trigger" v-bind="props">
    <slot />
  </PopoverTrigger>
</template>

<script lang="ts" setup>
  import { PopoverTrigger } from "reka-ui";
  import type { PopoverTriggerProps } from "reka-ui";

  const props = defineProps<PopoverTriggerProps>();
</script>
