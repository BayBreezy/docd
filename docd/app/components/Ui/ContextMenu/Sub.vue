<template>
  <ContextMenuSub data-slot="context-menu-sub" v-bind="forwarded">
    <slot />
  </ContextMenuSub>
</template>

<script lang="ts" setup>
  import { ContextMenuSub, useForwardPropsEmits } from "reka-ui";
  import type { ContextMenuSubEmits, ContextMenuSubProps } from "reka-ui";

  const props = defineProps<ContextMenuSubProps>();
  const emits = defineEmits<ContextMenuSubEmits>();

  const forwarded = useForwardPropsEmits(props, emits);
</script>
