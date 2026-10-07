<template>
  <ConfigProvider :use-id="useId">
    <NuxtAnnouncer />
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="var(--primary)" />
    <NuxtLayout>
      <DocsPageTransition>
        <NuxtPage :transition="false" />
      </DocsPageTransition>
    </NuxtLayout>
    <UiSonner />
    <DocsSearch v-model="searchModal" />
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from "reka-ui";
  import { useId } from "vue";
  const searchModal = useSearchModal();

  // Site-wide SEO defaults, editable from Studio. Pages override title/description in `useSeo`;
  // empty values fall back to the defaults set on `app.head` by the config module.
  const appConfig = useAppConfig();
  useSeoMeta({
    titleTemplate: () => appConfig.seo?.titleTemplate || undefined,
    title: () => appConfig.seo?.title || undefined,
    description: () => appConfig.seo?.description || undefined,
  });
</script>
