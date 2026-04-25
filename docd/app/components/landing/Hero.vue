<template>
  <div class="relative bg-background">
    <!-- Navbar — outside overflow-hidden so sticky works -->
    <nav
      class="sticky top-4 isolate z-50 container mx-auto rounded-md border border-border/60 bg-background/80 shadow-xs backdrop-blur-md"
    >
      <div class="flex h-14 items-center gap-4">
        <!-- Logo -->
        <slot name="logo">
          <NuxtLink :to="logoHref" class="flex shrink-0 items-center gap-2">
            <slot name="logo-icon">
              <template v-if="logoLight || logoDark">
                <img
                  v-if="logoLight"
                  :src="logoLight"
                  alt="Light Logo"
                  class="h-6 w-auto rounded border border-border/50 dark:hidden"
                />
                <img
                  v-if="logoDark"
                  :src="logoDark"
                  alt="Dark Logo"
                  class="hidden h-6 w-auto rounded border border-border/50 dark:block"
                />
              </template>
            </slot>
            <span v-if="siteName" class="text-sm font-semibold">{{ siteName }}</span>
          </NuxtLink>
        </slot>

        <!-- Nav links (desktop) -->
        <div
          v-if="navLinks?.length"
          class="hidden flex-1 items-center justify-center gap-0.5 md:flex"
        >
          <template v-for="link in navLinks" :key="link.label">
            <UiButton
              variant="ghost"
              size="sm"
              :to="link.href"
              class="gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              {{ link.label }}
              <Icon
                v-if="link.children?.length"
                name="lucide:chevron-down"
                class="size-3.5 opacity-60"
              />
            </UiButton>
          </template>
        </div>
        <div v-else class="flex-1" />

        <!-- Auth CTAs (desktop) -->
        <div class="hidden shrink-0 items-center gap-2 md:flex">
          <slot name="nav-actions">
            <DocsThemeCustomizer />
            <DocsSearchButton />
            <UiButton v-if="logInHref" variant="ghost" size="sm" :to="logInHref">
              {{ logInLabel }}
            </UiButton>
            <UiButton v-if="signUpHref" size="sm" :to="signUpHref">
              {{ signUpLabel }}
            </UiButton>
          </slot>
        </div>

        <!-- Mobile actions -->
        <slot name="nav-mobile-trigger">
          <div class="ml-auto flex items-center gap-1 md:hidden">
            <DocsThemeCustomizer />
            <DocsSearchButton />
            <UiButton
              variant="ghost"
              size="icon-sm"
              class="size-7"
              aria-label="Open navigation"
              @click="mobileNavOpen = true"
            >
              <Icon name="lucide:menu" class="size-4" />
            </UiButton>
          </div>
        </slot>
      </div>
    </nav>

    <DocsMobileNav v-model:open="mobileNavOpen" />

    <!-- Hero body — overflow-hidden scoped here so it doesn't trap sticky nav -->
    <section class="relative overflow-hidden">
      <UiBgPatternGrid
        size="lg"
        class="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2"
      />

      <!-- Hero content -->
      <UiContainer class="isolate pt-20 pb-12 text-center sm:pt-24">
        <!-- Badge -->
        <slot name="badge">
          <div v-if="badge" class="mb-8 flex justify-center">
            <NuxtLink :to="badge.href ?? '#'">
              <UiBadgeGroup size="lg" :addon-text="badge.label" theme="modern" pulse>
                {{ badge.text }}
              </UiBadgeGroup>
            </NuxtLink>
          </div>
        </slot>

        <!-- Headline -->
        <h1
          class="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          <slot name="headline">{{ headline }}</slot>
        </h1>

        <!-- Description -->
        <p
          v-if="description"
          class="mx-auto mt-5 max-w-3xl text-lg text-balance text-muted-foreground"
        >
          <slot name="description">{{ description }}</slot>
        </p>

        <!-- CTAs -->
        <slot name="ctas">
          <div
            v-if="primaryCta || secondaryCta"
            class="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
          >
            <UiButton
              v-if="primaryCta"
              size="lg"
              :to="primaryCta.href"
              class="order-1 w-full sm:order-2 sm:w-auto"
            >
              <Icon v-if="primaryCta.icon" :name="primaryCta.icon" class="size-4" />
              {{ primaryCta.label }}
            </UiButton>
            <UiButton
              v-if="secondaryCta"
              variant="secondary"
              size="lg"
              :to="secondaryCta.href"
              class="order-2 w-full sm:order-1 sm:w-auto"
            >
              <Icon v-if="secondaryCta.icon" :name="secondaryCta.icon" class="size-4" />
              {{ secondaryCta.label }}
            </UiButton>
          </div>
        </slot>
      </UiContainer>

      <!-- Mockup frame -->
      <div v-if="iframe" class="isolate pb-24">
        <UiContainer class="bg-background">
          <UiIframeLazy v-bind="iframe" />
        </UiContainer>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
  import type { HTMLAttributes } from "vue";

  export type HeroNavLink = {
    label: string;
    href?: string;
    children?: HeroNavLink[];
  };

  export type HeroBadge = {
    label: string;
    text: string;
    href?: string;
  };

  export type HeroCta = {
    label: string;
    href?: string;
    icon?: string;
  };

  export type HeroIframeProps = {
    src?: string;
    class?: HTMLAttributes["class"];
    iframeClass?: HTMLAttributes["class"];
    loading?: "lazy" | "eager";
    placeholder?: boolean;
    rootMargin?: string;
    threshold?: number | number[];
    disableScroll?: boolean;
  };

  const mobileNavOpen = ref(false);

  withDefaults(
    defineProps<{
      siteName?: string;
      logoHref?: string;
      logoLight?: string;
      logoDark?: string;
      navLinks?: HeroNavLink[];
      logInHref?: string;
      logInLabel?: string;
      signUpHref?: string;
      signUpLabel?: string;
      badge?: HeroBadge;
      headline?: string;
      description?: string;
      primaryCta?: HeroCta;
      secondaryCta?: HeroCta;
      iframe?: HeroIframeProps;
    }>(),
    {
      logoHref: "/",
      logInLabel: "Log in",
      signUpLabel: "Sign up",
      navLinks: () => [],
    }
  );
</script>
