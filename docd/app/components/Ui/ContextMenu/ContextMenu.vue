<template>
  <ContextMenuRoot data-slot="context-menu" v-bind="forwarded">
    <slot />
  </ContextMenuRoot>
</template>

<script lang="ts" setup>
  import { ContextMenuRoot, useForwardPropsEmits } from "reka-ui";
  import type { ContextMenuRootEmits, ContextMenuRootProps } from "reka-ui";

  const props = defineProps<ContextMenuRootProps>();
  const emit = defineEmits<ContextMenuRootEmits>();
  const forwarded = useForwardPropsEmits(props, emit);
</script>
