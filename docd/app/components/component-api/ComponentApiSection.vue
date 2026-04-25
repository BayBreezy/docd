<template>
  <div v-if="items.length" class="not-prose">
    <ProseFieldGroup v-if="layout === 'field'" variant="all">
      <ProseField
        v-for="item in items"
        :key="item.name"
        :name="item.name"
        :type="itemType(item)"
        :default-value="itemDefault(item)"
        :required="itemRequired(item)"
      >
        <template #default>
          <p v-if="item.description">{{ item.description }}</p>
          <p v-else class="text-muted-foreground">No description provided.</p>

          <div v-if="itemSignature(item)" class="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span class="font-medium text-foreground">Signature</span>
            <code class="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px]">
              {{ itemSignature(item) }}
            </code>
          </div>
        </template>
      </ProseField>
    </ProseFieldGroup>

    <ProseTable v-else>
      <thead>
        <tr class="border-b border-border text-left">
          <th class="px-4 py-3 text-sm font-semibold text-foreground">Name</th>
          <th class="px-4 py-3 text-sm font-semibold text-foreground">
            {{ kind === "events" ? "Signature" : "Type" }}
          </th>
          <th v-if="kind === 'props'" class="px-4 py-3 text-sm font-semibold text-foreground">
            Default
          </th>
          <th v-if="kind === 'props'" class="px-4 py-3 text-sm font-semibold text-foreground">
            Required
          </th>
          <th class="px-4 py-3 text-sm font-semibold text-foreground">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.name" class="border-b border-border last:border-b-0">
          <td class="px-4 py-3 align-top">
            <code class="font-mono text-xs text-foreground">{{ item.name }}</code>
          </td>
          <td class="px-4 py-3 align-top">
            <code class="font-mono text-xs text-foreground">
              {{ kind === "events" ? itemSignature(item) : itemType(item) }}
            </code>
          </td>
          <td v-if="kind === 'props'" class="px-4 py-3 align-top text-sm text-muted-foreground">
            <code v-if="itemDefault(item)" class="font-mono text-xs text-foreground">
              {{ itemDefault(item) }}
            </code>
            <span v-else>&mdash;</span>
          </td>
          <td v-if="kind === 'props'" class="px-4 py-3 align-top text-sm text-muted-foreground">
            {{ itemRequired(item) ? "Yes" : "No" }}
          </td>
          <td class="px-4 py-3 align-top text-sm text-muted-foreground">
            {{ item.description || "No description provided." }}
          </td>
        </tr>
      </tbody>
    </ProseTable>
  </div>

  <p v-else class="not-prose text-sm text-muted-foreground">No {{ emptyLabel }} documented.</p>
</template>

<script lang="ts">
  import type { ComponentApiSectionKind } from "../../../utils/component-api";
  import type {
    ProseComponentApiLayout,
    ProseComponentMetaEvent,
    ProseComponentMetaExposed,
    ProseComponentMetaProp,
    ProseComponentMetaSlot,
  } from "../../../utils/generate-prose-component-meta";
  export type ComponentApiSectionItem =
    | ProseComponentMetaProp
    | ProseComponentMetaSlot
    | ProseComponentMetaEvent
    | ProseComponentMetaExposed;

  export type ComponentApiSectionProps = {
    kind: ComponentApiSectionKind;
    items: ComponentApiSectionItem[];
    layout?: ProseComponentApiLayout;
  };
</script>

<script lang="ts" setup>
  const props = withDefaults(defineProps<ComponentApiSectionProps>(), {
    layout: "field",
  });

  function isPropItem(item: ComponentApiSectionItem): item is ProseComponentMetaProp {
    return "required" in item;
  }

  function isEventItem(item: ComponentApiSectionItem): item is ProseComponentMetaEvent {
    return "signature" in item;
  }

  function itemType(item: ComponentApiSectionItem) {
    return item.type || "unknown";
  }

  function itemDefault(item: ComponentApiSectionItem) {
    return isPropItem(item) ? item.default : undefined;
  }

  function itemRequired(item: ComponentApiSectionItem) {
    return isPropItem(item) ? item.required : false;
  }

  function itemSignature(item: ComponentApiSectionItem) {
    return isEventItem(item) ? item.signature : "";
  }

  const emptyLabel = computed(() => {
    switch (props.kind) {
      case "props":
        return "props";
      case "slots":
        return "slots";
      case "events":
        return "events";
      case "exposed":
        return "exposed members";
    }
  });
</script>
