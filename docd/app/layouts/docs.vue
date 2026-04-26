<template>
  <div class="grid min-h-dvh w-full grid-cols-1 tablet:grid-cols-[var(--nav-width)_minmax(0,1fr)]">
    <aside
      class="sticky top-0 z-20 hidden h-dvh flex-col border-r text-card-foreground tablet:flex"
      :class="isDashed ? 'border-dashed' : ''"
    >
      <div
        class="sticky top-0 mb-4 border-b bg-background/80 backdrop-blur-lg"
        :class="isDashed ? 'border-dashed' : ''"
      >
        <div class="flex h-(--header-height) items-center justify-between px-4">
          <DocsLogo />
          <DocsSearchButton v-if="!hideSearch" />
        </div>
      </div>
      <UiScrollArea
        class="h-[calc(100dvh-calc(var(--header-height)*2))] flex-1 mask-[linear-gradient(to_bottom,transparent,white_12px,white_calc(100%-12px),transparent)] px-4"
      >
        <DocsNav v-if="navigation" :items="navigation" />
      </UiScrollArea>
      <div
        class="mt-auto flex h-(--header-height) items-center justify-between gap-3 border-t px-2"
        :class="isDashed ? 'border-dashed' : ''"
      >
        <template v-if="hasGithub">
          <DocsGithubLink />
        </template>
        <div class="ml-auto flex items-center gap-1.5">
          <template v-if="hasGithub && (!hideThemeCustomizer || !hideLightDarkToggle)">
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
    </aside>
    <main class="flex min-h-dvh flex-col">
      <header
        class="sticky top-0 z-50 shrink-0 bg-background/80 backdrop-blur-lg"
        :class="isDashed ? 'border-dashed' : ''"
      >
        <DocsMobileBar />
        <div class="hidden border-b tablet:block" :class="isDashed ? 'border-dashed' : ''">
          <UiContainer class="flex h-(--header-height) items-center">
            <DocsHeader />
          </UiContainer>
        </div>
      </header>
      <PageMobileToc />
      <div class="grow">
        <slot />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
  const { navigation } = await useDocPage();
  const { isDashed, github, hasGithub, hideSearch, hideLightDarkToggle, hideThemeCustomizer } =
    useDocd();
</script>
