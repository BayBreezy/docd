<template>
  <DrawerClose data-slot="drawer-close" v-bind="props">
    <slot />
  </DrawerClose>
</template>

<script lang="ts" setup>
  import { DrawerClose } from "vaul-vue";
  import type { DrawerCloseProps } from "vaul-vue";

  const props = defineProps<DrawerCloseProps>();
</script>
