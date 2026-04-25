<template>
  <div data-slot="prose-pre-wrapper" :class="styles().wrapper({ class: $attrs?.class as any })">
    <template v-if="hasFileName">
      <div data-slot="prose-pre-file-name-wrapper" :class="styles().fileNameWrapper()">
        <prose-smart-icon v-if="iconFromMeta" :name="iconFromMeta" class="size-4 shrink-0" />
        <img
          v-else-if="language || filename"
          :src="getMaterialFileIcon(language! || filename!)"
          :alt="language || filename"
          class="size-4 shrink-0"
        />

        <p data-slot="prose-pre-file-name" :class="styles().fileName()">{{ fileNameEdited }}</p>
      </div>
    </template>
    <div
      v-if="!hideCopyButton"
      class="absolute right-3.5 flex items-center justify-center"
      :class="[hasFileName ? 'top-2.75' : 'top-3']"
    >
      <prose-code-copy :code @code-copied="onCopy" />
    </div>
    <ProseMermaid v-if="isMermaid" :code="code" @mermaid-error="onMermaidError">
      <slot />
    </ProseMermaid>
    <pre v-else :class="[$attrs?.class, 'shadow-xs ring-1 ring-border/60']"><slot /></pre>
  </div>
</template>

<script lang="ts" setup>
  import { getMaterialFileIcon } from "@baybreezy/file-extension-icon";
  import { startCase } from "lodash-es";

  const { page } = await useDocPage();
  const route = useRoute();

  const props = defineProps<{
    /**
     * The code content to display
     */
    code?: string;
    /**
     * The programming language of the code block
     */
    language?: string;
    /**
     * The filename to display in the header (if any)
     */
    filename?: string;
    /**
     * An array of line numbers to highlight
     */
    highlights?: Array<number>;
    /**
     * Additional meta information for the code block
     */
    meta?: string;
    /**
     * Optional icon name to display next to the filename
     */
    icon?: string;
  }>();

  /**
   * Parse meta string and create a lowercase key map for easy checking
   * Example: "noFormat hideHeader icon='lucide:code'" => Map { 'noformat' => true, 'hideheader' => true, 'icon' => 'lucide:code' }
   */
  const metaMap = computed(() => {
    const map = new Map<string, string | boolean>();
    if (!props.meta) return map;

    // Split by spaces but preserve quoted values
    const parts = props.meta.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];

    parts.forEach((part) => {
      // Check if it's a key=value pair
      const keyValueMatch = part.match(/^([^=]+)=(.+)$/);
      if (keyValueMatch) {
        const key = keyValueMatch[1]!.toLowerCase();
        // Remove quotes from value if present
        const value = keyValueMatch[2]!.replace(/^["']|["']$/g, "");
        map.set(key, value);
      } else {
        // It's just a flag (boolean)
        map.set(part.toLowerCase(), true);
      }
    });

    return map;
  });

  const hideCopyButton = ref(false);
  const noFormatMeta = computed(() => metaMap.value.has("noformat"));
  const hideHeaderMeta = computed(
    () => metaMap.value.has("hideheader") || metaMap.value.has("noheader")
  );
  const hasLinesInMeta = computed(() => metaMap.value.has("lines"));
  const metaHasMermaid = computed(() => metaMap.value.has("mermaid"));

  const iconFromMeta = computed(() => {
    // First check if icon is passed as a direct prop
    if (props.icon) return props.icon;
    // Then check metaMap for icon key
    const icon = metaMap.value.get("icon");
    return typeof icon === "string" ? icon : undefined;
  });

  const fileNameEdited = computed(() => {
    if (!props.filename) return;
    if (noFormatMeta.value) return props.filename;

    let processedName = props.filename;

    // Check if it looks like a filename (ends with .[anything])
    const hasFileExtension = /\.[^.]+$/.test(processedName);

    if (hasFileExtension) {
      // It's a filename - remove the extension
      processedName = processedName.split(".").slice(0, -1).join(".");
      // if we have something like .env or .gitignore, we might end up with an empty string
      if (!processedName) {
        processedName = props.filename;
      }
    }

    // Clean up any extra spaces and apply startCase
    return startCase(processedName.trim());
  });

  const hasFileName = computed(() => !!props.filename && !hideHeaderMeta.value);
  const isMermaid = computed(() => props.language === "mermaid" || metaHasMermaid.value);

  const onMermaidError = (errorMessage?: string) => {
    if (errorMessage) {
      hideCopyButton.value = true;
    } else {
      hideCopyButton.value = false;
    }
  };

  const onCopy = () => {
    // Track copied code event
    useTrackEvent("copy_code", {
      code_source: "inline",
      code_language: props.language,
      file_name: props.filename,
      block_path: "N/A",
      component: props.filename,
      page_title: page.value?.title || "unknown",
      page_path: route.path,
      page_location: window.location.href,
    });
  };

  const styles = tv({
    slots: {
      wrapper: [
        "relative mt-3 rounded-lg border bg-muted/60 p-1.5 dark:bg-muted/10",
        hasLinesInMeta.value && "show-line-number",
      ],
      fileNameWrapper: "not-prose flex items-center gap-2 p-2 pb-4",
      fileName: "truncate text-sm font-medium text-ellipsis",
    },
  });
</script>

<style>
  .show-line-number .line::before {
    font-size: var(--text-sm);
    line-height: var(--tw-leading, var(--text-xs--line-height));
    width: calc(var(--spacing) * 5);
    display: inline-block;
    text-align: center;
    margin-right: calc(var(--spacing) * 4);
    color: var(--muted-foreground);
  }

  .show-line-number .line:not(.diff)::before {
    content: attr(line);
  }
</style>
