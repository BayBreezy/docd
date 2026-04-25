<template>
  <DrawerPortal data-slot="drawer-portal" v-bind="props">
    <slot />
  </DrawerPortal>
</template>

<script lang="ts" setup>
  import { DrawerPortal } from "vaul-vue";
  import type { DrawerPortalProps } from "vaul-vue";

  const props = defineProps<DrawerPortalProps>();
</script>
