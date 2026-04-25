<template>
  <PopoverPortal data-slot="popover-portal" v-bind="forwarded">
    <slot />
  </PopoverPortal>
</template>

<script lang="ts" setup>
  import { PopoverPortal, useForwardProps } from "reka-ui";
  import type { PopoverPortalProps } from "reka-ui";

  const props = defineProps<PopoverPortalProps>();
  const forwarded = useForwardProps(props);
</script>
