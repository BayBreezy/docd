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

  const { data: page } = await useAsyncData<LandingPage | null>("landing", () =>
    queryCollection("landing" as never)
      .path(route.path)
      .first()
      .then((r) => r ?? null)
  );

  if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
  }

  const title = page.value?.seo?.title || page.value?.title;
  const description = page.value?.seo?.description || page.value?.description;

  useSeo({ title, description, type: "website" });

  defineOgImage("Landing", {
    title: title?.slice(0, 60),
    description: formatOgDescription(title, description),
  });
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
