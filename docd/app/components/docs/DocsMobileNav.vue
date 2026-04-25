<template>
  <UiDrawer v-model:open="open">
    <UiDrawerContent hide-knob class="mx-2 flex h-full flex-col gap-0 border p-0">
      <UiDrawerTitle class="sr-only">Mobile Navigation</UiDrawerTitle>
      <UiDrawerDescription class="sr-only">Main navigation for mobile devices</UiDrawerDescription>
      <UiDrawerHeader
        class="flex items-center justify-between border-b px-4 py-0"
        :class="isDashed ? 'border-dashed' : ''"
      >
        <DocsLogo />
        <UiDrawerClose as-child>
          <UiButton variant="ghost" size="icon-sm" class="size-7 text-muted-foreground">
            <Icon name="lucide:x" class="size-4" />
          </UiButton>
        </UiDrawerClose>
      </UiDrawerHeader>

      <UiScrollArea
        class="min-h-0 flex-1 mask-[linear-gradient(to_bottom,transparent,white_12px,white_calc(100%-12px),transparent)] px-4 py-4"
      >
        <DocsNav v-if="navigation" :items="navigation" />
      </UiScrollArea>

      <div
        class="mt-auto flex h-(--header-height) items-center justify-between gap-3 border-t px-2"
        :class="isDashed ? 'border-dashed' : ''"
      >
        <DocsGithubLink v-if="github" />
        <div class="ml-auto flex items-center gap-1.5">
          <template v-if="github && (!hideThemeCustomizer || !hideLightDarkToggle)">
            <UiDivider
              :type="isDashed ? 'dashed' : 'solid'"
              orientation="vertical"
              class="h-[calc(var(--header-height)-2rem)]"
            />
          </template>
          <DocsThemeCustomizer v-if="!hideThemeCustomizer" />
          <DocsThemeToggler v-if="!hideLightDarkToggle" class="dark:text-muted-foreground" />
        </div>
      </div>
    </UiDrawerContent>
  </UiDrawer>
</template>

<script lang="ts" setup>
  const open = defineModel<boolean>("open", { default: false });
  const { navigation } = await useDocPage();
  const { isDashed, github, hideThemeCustomizer, hideLightDarkToggle } = useDocd();
</script>
