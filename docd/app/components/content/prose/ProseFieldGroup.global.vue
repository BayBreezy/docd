<template>
  <div :class="styles.base({ variant })">
    <slot />
  </div>
</template>

<script lang="ts">
  import { tv } from "tailwind-variants";

  /**
   * Field group styles configuration using tailwind-variants
   */
  export const fieldGroupStyles = tv({
    slots: {
      base: "flex flex-col",
    },
    variants: {
      variant: {
        /**
         * Add dividers between fields
         */
        divided: "[&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-border",
        /**
         * Add striped background to alternate fields
         */
        striped: "*:pl-4 [&>*:nth-child(even)]:bg-muted dark:[&>*:nth-child(even)]:bg-muted/50",
        /**
         * Add border around the group
         */
        bordered:
          "overflow-hidden rounded-lg border border-border *:pl-4 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-border",
        /**
         * A combination of all variants
         */
        all: "overflow-hidden rounded-lg border border-border *:pl-4 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-border [&>*:nth-child(even)]:bg-muted dark:[&>*:nth-child(even)]:bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "divided",
    },
  });

  /**
   * Field group component props type
   */
  export type ProseFieldGroupProps = {
    /**
     * The variant style of the field group
     *
     * @default "divided"
     */
    variant?: "divided" | "striped" | "bordered" | "all";
  };
</script>

<script lang="ts" setup>
  withDefaults(defineProps<ProseFieldGroupProps>(), {
    variant: "divided",
  });

  const styles = fieldGroupStyles();
</script>
