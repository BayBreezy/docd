<template>
  <define-tree-child v-slot="{ items: childItems, level }">
    <li v-for="item in childItems" :key="item.path">
      <TreeItem v-slot="{ isExpanded, isSelected }" as-child :level="level" :value="item">
        <button
          type="button"
          :aria-expanded="item.children?.length ? isExpanded : undefined"
          :aria-label="item.children?.length ? `${item.label} folder` : `${item.label} file`"
          class="inline-flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          :class="[
            isSelected || lastSelectedItem?.path === item.path ? 'bg-muted text-primary' : '',
          ]"
        >
          <!-- Folder/File Icon -->
          <img
            v-if="item.children?.length"
            :src="getMaterialFolderIcon(item.label, isExpanded)"
            :alt="`${item.label} folder ${isExpanded ? 'expanded' : 'collapsed'}`"
            class="size-4 shrink-0"
          />
          <img
            v-else
            :src="getMaterialFileIcon(item.label)"
            :alt="`${item.label} file`"
            class="size-4 shrink-0"
          />

          <!-- Label -->
          <span class="truncate">{{ item.label }}</span>

          <!-- Chevron for folders -->
          <Icon
            v-if="item.children?.length"
            name="lucide:chevron-down"
            class="ml-auto size-4 shrink-0 text-muted-foreground transition-transform"
            :class="[isExpanded ? 'rotate-0' : '-rotate-90']"
            aria-hidden="true"
          />
        </button>

        <!-- Nested children -->
        <ul v-if="item.children?.length && isExpanded" role="group" class="pl-4">
          <TreeChild :items="item.children" :level="level + 1" />
        </ul>
      </TreeItem>
    </li>
  </define-tree-child>

  <div
    data-slot="prose-code-tree"
    class="grid overflow-hidden rounded-lg border lg:grid-cols-3"
    :class="props.class"
  >
    <nav class="not-prose h-full overflow-hidden px-2" aria-label="File tree navigation">
      <template v-if="props.title">
        <div class="p-2 py-4 text-sm font-medium">
          <span>
            {{ props.title }}
          </span>
        </div>
        <UiGradientDivider />
      </template>
      <!-- Tree Navigation -->
      <div class="max-h-[520px] overflow-y-auto py-2">
        <TreeRoot
          v-model="selectedItem"
          :items="treeItems"
          :get-key="(item) => item.path"
          :default-expanded="expandedPaths"
        >
          <ul class="space-y-1" role="tree">
            <TreeChild :items="treeItems" :level="0" />
          </ul>
        </TreeRoot>
      </div>
    </nav>

    <!-- Content Display -->
    <div
      class="grid min-h-[240px] grid-cols-1 lg:col-span-2"
      role="region"
      aria-label="File content"
      aria-live="polite"
    >
      <component
        :is="lastSelectedItem?.component"
        v-if="lastSelectedItem"
        meta="noFormat"
        class="mt-0 data-[slot=prose-pre-wrapper]:h-full data-[slot=prose-pre-wrapper]:rounded-none data-[slot=prose-pre-wrapper]:border-0 data-[slot=prose-pre-wrapper]:border-t lg:data-[slot=prose-pre-wrapper]:border-t-0 lg:data-[slot=prose-pre-wrapper]:border-l [&_pre]:h-[calc(100%-45px)] [&_pre]:flex-1 [&>*:first-child]:mt-0"
      />
      <div v-else class="flex h-full items-center justify-center text-sm text-muted-foreground">
        Select a file to view its content
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getMaterialFileIcon, getMaterialFolderIcon } from "@baybreezy/file-extension-icon";
  import type { HTMLAttributes } from "vue";

  /**
   * TreeItem represents a node in the file tree structure
   */
  type TreeItem = {
    /** Display label for the node */
    label: string;
    /** Full path from root */
    path: string;
    /** Child nodes (only for directories) */
    children?: TreeItem[];
    /** Vue component to render when selected (only for files) */
    component?: any;
  };

  const props = withDefaults(
    defineProps<{
      /**
       * Default file path to select on mount
       * @example "src/components/Button.vue"
       */
      defaultValue?: string;
      /**
       * Expand all directories by default instead of just the path to defaultValue
       * @default false
       */
      expandAll?: boolean;
      /**
       * Optional title displayed above the file tree
       * @example "Project Structure"
       */
      title?: string;
      /**
       * Additional CSS classes for the root container
       */
      class?: HTMLAttributes["class"];
    }>(),
    {
      defaultValue: undefined,
      expandAll: false,
    }
  );

  const [DefineTreeChild, TreeChild] = createReusableTemplate<{
    items: TreeItem[];
    level: number;
  }>();

  const selectedItem = ref<TreeItem>();
  const lastSelectedItem = ref<TreeItem>();
  const rerenderCount = ref(0);

  // Get slot items from default slot - these are the code blocks passed as children
  const { items: slotItems } = useDefaultSlotItems({
    slots: useSlots(),
    mapMeta: ({ props, vnode }) => ({
      path: props.path || props.filename || props.label,
      icon: props.icon,
      component: vnode,
    }),
  });

  /**
   * Build hierarchical tree structure from flat slot items
   * Converts flat file paths like "src/components/Button.vue" into nested tree nodes
   */
  const treeItems = computed(() => {
    // Trigger rerender when slots change
    void rerenderCount.value;

    const flatItems = slotItems.value.map((item) => ({
      label: item.meta.path,
      icon: item.meta.icon,
      component: item.meta.component,
    }));

    return buildTree(flatItems);
  });

  /**
   * Build tree structure from flat file paths
   * Automatically creates parent directory nodes and sorts alphabetically
   */
  function buildTree(items: { label: string; icon?: string; component?: any }[]): TreeItem[] {
    const map = new Map<string, TreeItem>();
    const root: TreeItem[] = [];

    items.forEach((item) => {
      const parts = item.label.split("/");
      let path = "";

      parts.forEach((part, i) => {
        path = path ? `${path}/${part}` : part;

        if (!map.has(path)) {
          const isLeaf = i === parts.length - 1;
          const node: TreeItem = {
            label: part,
            path,
            ...(isLeaf ? { component: item.component, icon: item.icon } : { children: [] }),
          };

          map.set(path, node);

          if (i === 0) {
            root.push(node);
          } else {
            const parentPath = parts.slice(0, i).join("/");
            map.get(parentPath)?.children?.push(node);
          }
        }
      });
    });

    // Sort function
    const sort = (nodes: TreeItem[]): TreeItem[] =>
      nodes
        .sort((a, b) =>
          !!a.children === !!b.children ? a.label.localeCompare(b.label) : a.children ? -1 : 1
        )
        .map((n) => ({ ...n, children: n.children && sort(n.children) }));

    return sort(root);
  }

  /**
   * Calculate which paths should be expanded based on the selected item or expandAll prop
   */
  const expandedPaths = computed(() => {
    if (props.expandAll) {
      const allPaths = new Set<string>();
      slotItems.value.forEach((item) => {
        const parts = item.meta.path.split("/");
        for (let i = 1; i < parts.length; i++) {
          allPaths.add(parts.slice(0, i).join("/"));
        }
      });
      return Array.from(allPaths);
    }

    const path = selectedItem.value?.path || props.defaultValue;
    if (!path) return [];

    const parts = path.split("/");
    return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join("/"));
  });

  /**
   * Watch for selection changes and update lastSelectedItem if a file (not folder) is selected
   */
  watch(selectedItem, (newVal) => {
    if (newVal && !newVal.children?.length) {
      lastSelectedItem.value = newVal;
    }
  });

  /**
   * Set initial selection on mount if defaultValue is provided
   */
  onMounted(() => {
    if (props.defaultValue) {
      const findItem = (items: TreeItem[]): TreeItem | undefined => {
        for (const item of items) {
          if (item.path === props.defaultValue) return item;
          if (item.children) {
            const found = findItem(item.children);
            if (found) return found;
          }
        }
      };
      const initial = findItem(treeItems.value);
      if (initial) {
        selectedItem.value = initial;
      }
    }
  });
</script>
