<template>
  <hr
    data-slot="prose-hr"
    :class="proseHrStyles({ class: normalizeClass(_class) || undefined, isDashed })"
  />
</template>

<script lang="ts">
  import { normalizeClass } from "vue";
  import type { HTMLAttributes } from "vue";

  export type ProseHrProps = {
    /**
     * Additional classes for the parent element
     */
    class?: HTMLAttributes["class"];
  };

  export const proseHrStyles = tv({
    base: "mb-6 not-first:mt-6",
    variants: {
      isDashed: {
        true: "border-dashed",
        false: "border-solid",
      },
    },
  });
</script>

<script setup lang="ts">
  const { class: _class } = defineProps<ProseHrProps>();
  const { isDashed } = useDocd();
</script>
