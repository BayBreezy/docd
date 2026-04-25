<template>
  <DrawerTrigger data-slot="drawer-trigger" v-bind="props">
    <slot />
  </DrawerTrigger>
</template>

<script lang="ts" setup>
  import { DrawerTrigger } from "vaul-vue";
  import type { DrawerTriggerProps } from "vaul-vue";

  const props = defineProps<DrawerTriggerProps>();
</script>
