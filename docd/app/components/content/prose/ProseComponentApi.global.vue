<template>
  <div v-if="resolvedMeta" class="not-prose">
    <div v-if="title" class="mb-4">
      <p class="text-lg font-semibold tracking-tight text-foreground">{{ title }}</p>
    </div>

    <ProseTabs v-if="sectionCount > 1" :variant="tabsVariant">
      <div
        v-for="section in visibleSections"
        :key="section.kind"
        :label="section.label"
        :icon="section.icon"
        class="[&>*:first-child]:mt-0"
      >
        <component :is="section.component" :items="section.items" :layout="layout" />
      </div>
    </ProseTabs>

    <div v-else-if="visibleSections[0]" class="space-y-6">
      <component
        :is="visibleSections[0]?.component"
        :items="visibleSections[0].items"
        :layout="layout"
      />
    </div>

    <p v-else class="text-sm text-muted-foreground">
      No matching component API sections were found.
    </p>
  </div>

  <p v-else class="not-prose text-sm text-muted-foreground">
    No component metadata was found for <code>{{ path }}</code
    >.
  </p>
</template>

<script lang="ts">
  import type { ComponentApiSectionKind } from "../../../../utils/component-api";
  import type {
    ProseComponentApiLayout,
    ProseComponentMetaEntry,
  } from "../../../../utils/generate-prose-component-meta";
  import type { ProseTabsProps } from "./ProseTabs.global.vue";

  export type ProseComponentApiProps = {
    path?: string;
    meta?: ProseComponentMetaEntry | null;
    layout?: ProseComponentApiLayout;
    sections?: ComponentApiSectionKind[] | string;
    title?: string;
    tabsVariant?: ProseTabsProps["variant"];
  };
</script>

<script lang="ts" setup>
  import { normalizeComponentApiSections } from "../../../../utils/component-api";

  const props = withDefaults(defineProps<ProseComponentApiProps>(), {
    layout: "table",
    tabsVariant: "line",
  });

  const resolvedMeta = computed(() => props.meta ?? resolveProseComponentMeta(props.path));
  const requestedSections = computed(() => normalizeComponentApiSections(props.sections));
  const sectionDefinitions = {
    props: {
      label: "Props",
      icon: "lucide:sliders-horizontal",
      component: "ProseComponentProps",
    },
    slots: {
      label: "Slots",
      icon: "lucide:panel-top",
      component: "ProseComponentSlots",
    },
    events: {
      label: "Events",
      icon: "lucide:zap",
      component: "ProseComponentEvents",
    },
    exposed: {
      label: "Exposed",
      icon: "lucide:square-function",
      component: "ProseComponentExposed",
    },
  } as const;

  const visibleSections = computed(() => {
    if (!resolvedMeta.value) {
      return [];
    }

    return requestedSections.value
      .map((kind) => ({
        kind,
        ...sectionDefinitions[kind],
        items: resolvedMeta.value?.[kind] || [],
      }))
      .filter((section) => section.items.length);
  });

  const sectionCount = computed(() => visibleSections.value.length);
</script>
