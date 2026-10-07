<script setup lang="ts">
  interface LandingPage {
    title?: string;
    description?: string;
    layout?: string;
    seo?: {
      title?: string;
      description?: string;
    };
  }

  definePageMeta({ middleware: "landing-page-layout" });

  const route = useRoute();

  const { data: page } = await useAsyncData<LandingPage | null>(
    docPageKey("landing", route.path),
    () => fetchDocPage("landing", route.path) as Promise<LandingPage | null>,
    { getCachedData: getSharedCachedData }
  );

  if (!page.value) {
    throw createError({ status: 404, statusText: "Page not found", fatal: true });
  }

  const title = page.value?.seo?.title || page.value?.title;
  const description = page.value?.seo?.description || page.value?.description;

  useSeo({ title, description, type: "website" });

  defineOgImage("Landing", {
    title: formatOgTitle(title),
    description: formatOgDescription(title, description),
  });
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
