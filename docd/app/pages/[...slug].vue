<template>
  <div
    :class="[
      toc && toc.links && toc.links.length && !page?.hideToc
        ? 'xl:grid-cols-[1fr_var(--nav-width)]'
        : 'xl:grid-cols-1',
    ]"
    class="xl:grid xl:gap-5"
  >
    <div
      v-if="page"
      class="container prose prose-base max-w-7xl min-w-0 py-5 dark:prose-invert prose-headings:scroll-mt-20 prose-headings:tracking-tight prose-h2:mt-6 prose-h2:border-b prose-h2:pb-3 first:prose-h2:mt-10 prose-a:text-primary prose-a:no-underline prose-a:hover:underline prose-a:hover:underline-offset-2 prose-pre:my-0 prose-pre:rounded-sm prose-pre:p-2 prose-pre:px-0 prose-pre:text-base"
      :class="[isDashed ? 'prose-headings:border-dashed' : '']"
    >
      <PageHeader />
      <ContentRenderer :value="page" />
      <PageFooter />
    </div>
    <PageToc />
  </div>
</template>

<script lang="ts" setup>
  import { findPageHeadline } from "@nuxt/content/utils";

  definePageMeta({ middleware: "doc-page-layout" });

  const route = useRoute();

  const { page, navigation, headline, breadcrumbs } = await useDocPage();
  const { isDashed } = useDocd();

  if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
  }

  const title = page.value?.seo?.title || page.value?.title;
  const description = page.value?.seo?.description || page.value?.description;

  const publishedAt = computed(() => page.value?.publishedAt || undefined);
  const modifiedAt = computed(() => page.value?.modifiedAt || undefined);

  useSeo({ title, description, type: "article", publishedAt, modifiedAt, breadcrumbs });
  watch(
    () => navigation?.value,
    () => {
      headline.value = findPageHeadline(navigation?.value, page.value?.path) || headline.value;
    }
  );
  // Add the page path to the prerender list
  addPrerenderPath(`/raw${route.path}.md`);

  defineOgImage("Docs.takumi", {
    title: title?.slice(0, 60),
    description: formatOgDescription(title, description),
    headline: headline.value,
  });

  const toc = computed(() => {
    if (!page.value) return;
    return page.value?.body?.toc;
  });
</script>
