<template>
  <TreeRoot v-slot="slotProps" data-slot="tree" v-bind="forwarded">
    <slot v-bind="slotProps" />
  </TreeRoot>
</template>

<script lang="ts" setup>
  import { TreeRoot, useForwardPropsEmits } from "reka-ui";
  import type { TreeRootEmits, TreeRootProps } from "reka-ui";

  const props = defineProps<TreeRootProps>();
  const emit = defineEmits<TreeRootEmits>();

  const forwarded = useForwardPropsEmits(props, emit);
</script>
