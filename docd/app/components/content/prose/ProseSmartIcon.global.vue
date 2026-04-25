<template>
  <!-- Iconify Icons -->
  <Icon v-if="checkIcon(name)" :name :size />
  <!-- Emojis -->
  <span
    v-else-if="
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g.test(
        name
      )
    "
    :style="`font-size: ${size}px;`"
    aria-hidden="true"
    >{{ name }}</span
  >
  <!-- Link -->
  <NuxtImg
    v-else
    :src="name"
    :style="`width: ${size}px; height: ${size}px;`"
    :class="['not-prose inline', $attrs.class]"
  />
</template>

<script lang="ts">
  import { stringToIcon, validateIconName } from "@iconify/utils";

  export type SmartIconProps = {
    /**
     * This can be on of the following:
     *
     * - An [Iconify](https://icon-sets.iconify.design/) icon name, e.g. `mdi:home`
     * - An emoji, e.g. `😀`
     * - A link to an image, e.g. `https://example.com/icon.png`
     */
    name: string;
    /**
     * Size of the icon in pixels (default: 16)
     * @default 16
     */
    size?: number;
  };
</script>

<script setup lang="ts">
  const { size = 16 } = defineProps<SmartIconProps>();

  /**
   * Check if the provided name is a valid Iconify icon name
   */
  function checkIcon(name: string): boolean {
    if (name.includes("http") || name.startsWith("data:image/")) return false;
    return validateIconName(stringToIcon(name));
  }
</script>
