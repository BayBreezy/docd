<template>
  <ConfigProvider :use-id="useId">
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
</script>
