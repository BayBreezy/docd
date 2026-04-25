<template>
  <ComponentApiSection kind="events" :items="resolvedItems" :layout="layout" />
</template>

<script lang="ts">
  import type {
    ProseComponentApiLayout,
    ProseComponentMetaEntry,
    ProseComponentMetaEvent,
  } from "../../../../utils/generate-prose-component-meta";

  export type ProseComponentEventsProps = {
    path?: string;
    meta?: ProseComponentMetaEntry | null;
    items?: ProseComponentMetaEvent[];
    layout?: ProseComponentApiLayout;
  };
</script>

<script lang="ts" setup>
  const props = withDefaults(defineProps<ProseComponentEventsProps>(), {
    layout: "field",
  });

  const resolvedMeta = computed(() => props.meta ?? resolveProseComponentMeta(props.path));
  const resolvedItems = computed(() => props.items ?? resolvedMeta.value?.events ?? []);
</script>
