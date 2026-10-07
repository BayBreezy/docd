<template>
  <NuxtLayout name="default">
    <div class="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <p class="text-sm font-medium text-muted-foreground">{{ error.status }}</p>
      <h1 class="text-3xl font-semibold tracking-tight text-balance">{{ heading }}</h1>
      <p class="max-w-md text-muted-foreground">{{ message }}</p>
      <UiButton class="mt-2" @click="clearError({ redirect: '/' })">
        <Icon name="lucide:arrow-left" />
        Back to home
      </UiButton>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
  import type { NuxtError } from "#app";

  const props = defineProps<{ error: NuxtError }>();

  const isNotFound = computed(() => props.error.status === 404);
  const heading = computed(() => (isNotFound.value ? "Page not found" : "Something went wrong"));
  const message = computed(() =>
    isNotFound.value
      ? "The page you are looking for doesn't exist or has been moved."
      : "An unexpected error occurred while loading this page."
  );

  // The error page replaces `app.vue`, so apply the site-wide title template here too
  const appConfig = useAppConfig();
  useSeoMeta({
    titleTemplate: () => appConfig.seo?.titleTemplate || undefined,
    title: heading,
    description: message,
  });
</script>
