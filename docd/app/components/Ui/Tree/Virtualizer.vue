<template>
  <TreeVirtualizer v-slot="slotProps" data-slot="tree-virtualizer" v-bind="forwarded">
    <slot v-bind="slotProps" />
  </TreeVirtualizer>
</template>

<script lang="ts" setup>
  import { TreeVirtualizer, useForwardPropsEmits } from "reka-ui";
  import type { TreeVirtualizerProps } from "reka-ui";

  const props = defineProps<TreeVirtualizerProps>();
  const forwarded = useForwardPropsEmits(props);
</script>
