<template>
  <ComponentApiSection kind="props" :items="resolvedItems" :layout="layout" />
</template>

<script lang="ts">
  import type {
    ProseComponentApiLayout,
    ProseComponentMetaEntry,
    ProseComponentMetaProp,
  } from "../../../../utils/generate-prose-component-meta";

  export type ProseComponentPropsProps = {
    path?: string;
    meta?: ProseComponentMetaEntry | null;
    items?: ProseComponentMetaProp[];
    layout?: ProseComponentApiLayout;
  };
</script>

<script lang="ts" setup>
  const props = withDefaults(defineProps<ProseComponentPropsProps>(), {
    layout: "field",
  });

  const resolvedMeta = computed(() => props.meta ?? resolveProseComponentMeta(props.path));
  const resolvedItems = computed(() => props.items ?? resolvedMeta.value?.props ?? []);
</script>
