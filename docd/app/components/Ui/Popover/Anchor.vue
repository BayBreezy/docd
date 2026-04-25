<template>
  <PopoverAnchor data-slot="popover-anchor" v-bind="forwarded">
    <slot />
  </PopoverAnchor>
</template>

<script lang="ts" setup>
  import { PopoverAnchor, useForwardProps } from "reka-ui";
  import type { PopoverAnchorProps } from "reka-ui";

  const props = defineProps<PopoverAnchorProps>();
  const forwarded = useForwardProps(props);
</script>
