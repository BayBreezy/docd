<template>
  <div :class="proseTableStyles({ class: normalizeClass(_class) || undefined, isDashed })">
    <table class="relative mt-0 mb-0 w-full overflow-hidden border-none" data-slot="prose-table">
      <slot />
    </table>
  </div>
</template>

<script lang="ts">
  import { normalizeClass } from "vue";
  import type { HTMLAttributes } from "vue";

  export type ProseTableProps = {
    /**
     * Additional classes for the parent element
     */
    class?: HTMLAttributes["class"];
  };

  export const proseTableStyles = tv({
    base: "w-full overflow-y-auto rounded-md border not-last:mb-6",
    variants: {
      isDashed: {
        true: "border-dashed",
        false: "",
      },
    },
  });
</script>

<script setup lang="ts">
  const { class: _class } = defineProps<ProseTableProps>();
  const { isDashed } = useDocd();
</script>
