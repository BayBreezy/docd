<template>
  <ComponentApiSection kind="slots" :items="resolvedItems" :layout="layout" />
</template>

<script lang="ts">
  import type {
    ProseComponentApiLayout,
    ProseComponentMetaEntry,
    ProseComponentMetaSlot,
  } from "../../../../utils/generate-prose-component-meta";

  export type ProseComponentSlotsProps = {
    path?: string;
    meta?: ProseComponentMetaEntry | null;
    items?: ProseComponentMetaSlot[];
    layout?: ProseComponentApiLayout;
  };
</script>

<script lang="ts" setup>
  const props = withDefaults(defineProps<ProseComponentSlotsProps>(), {
    layout: "field",
  });

  const resolvedMeta = computed(() => props.meta ?? resolveProseComponentMeta(props.path));
  const resolvedItems = computed(() => props.items ?? resolvedMeta.value?.slots ?? []);
</script>
