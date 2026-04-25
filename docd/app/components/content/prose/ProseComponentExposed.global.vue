<template>
  <ComponentApiSection kind="exposed" :items="resolvedItems" :layout="layout" />
</template>

<script lang="ts">
  import type {
    ProseComponentApiLayout,
    ProseComponentMetaEntry,
    ProseComponentMetaExposed,
  } from "../../../../utils/generate-prose-component-meta";

  export type ProseComponentExposedProps = {
    path?: string;
    meta?: ProseComponentMetaEntry | null;
    items?: ProseComponentMetaExposed[];
    layout?: ProseComponentApiLayout;
  };
</script>

<script lang="ts" setup>
  const props = withDefaults(defineProps<ProseComponentExposedProps>(), {
    layout: "field",
  });

  const resolvedMeta = computed(() => props.meta ?? resolveProseComponentMeta(props.path));
  const resolvedItems = computed(() => props.items ?? resolvedMeta.value?.exposed ?? []);
</script>
