<template>
  <ClientOnly>
    <template #fallback>
      <UiButton size="icon-sm" variant="ghost" disabled>
        <Icon name="lucide:palette" />
      </UiButton>
    </template>
    <UiPopover v-if="isDesktop">
      <UiTooltip>
        <UiTooltipTrigger as-child>
          <UiPopoverTrigger as-child>
            <UiButton size="icon-sm" variant="ghost">
              <Icon name="lucide:palette" />
            </UiButton>
          </UiPopoverTrigger>
        </UiTooltipTrigger>
        <UiPopoverContent
          translucent
          class="w-auto overflow-y-auto p-4"
          side="right"
          align="end"
          :side-offset="8"
        >
          <DocsThemeCustomizerCore />
        </UiPopoverContent>
        <UiTooltipContent> Customize theme </UiTooltipContent>
      </UiTooltip>
    </UiPopover>
    <UiDrawer v-else>
      <UiDrawerTrigger as-child>
        <UiButton size="icon-sm" variant="ghost">
          <Icon name="lucide:palette" />
        </UiButton>
      </UiDrawerTrigger>
      <UiDrawerContent class="w-full px-4 pb-6">
        <UiDrawerHeader>
          <UiDrawerTitle class="sr-only">Theme Customizer</UiDrawerTitle>
          <UiDrawerDescription class="sr-only"
            >Pick a style and color for your components.</UiDrawerDescription
          >
        </UiDrawerHeader>
        <DocsThemeCustomizerCore />
      </UiDrawerContent>
    </UiDrawer>
  </ClientOnly>
</template>

<script lang="ts" setup>
  import { breakpointsTailwind } from "@vueuse/core";

  const bp = useBreakpoints(breakpointsTailwind);
  const isDesktop = bp.greaterOrEqual("lg");
</script>
