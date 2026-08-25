<template>
  <NuxtLink
    data-slot="prose-a"
    v-bind="rest"
    :class="proseAStyles({ class: normalizeClass(props.class) || undefined })"
  >
    <slot />
  </NuxtLink>
</template>

<script lang="ts">
  import { reactiveOmit } from "@vueuse/core";
  import { normalizeClass } from "vue";
  import type { HTMLAttributes } from "vue";

  import type { NuxtLinkProps } from "#app";

  export type ProseAProps = NuxtLinkProps & {
    /**
     * Additional classes for the parent element
     */
    class?: HTMLAttributes["class"];
  };

  export const proseAStyles = tv({
    base: "font-semibold text-inherit underline underline-offset-4",
  });
</script>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<
      ProseAProps & {
        custom?: true | undefined;
      }
    >(),
    {
      noRel: undefined,
      prefetch: undefined,
      noPrefetch: undefined,
      replace: undefined,
      external: undefined,
      custom: undefined,
    }
  );
  const rest = reactiveOmit(props, "class");
</script>
