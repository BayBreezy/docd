<template>
  <div class="not-prose mb-10">
    <p
      v-if="headline && !hasFancyIcon"
      class="mb-4 font-bold tracking-tight text-primary capitalize"
    >
      {{ headline }}
    </p>
    <div class="flex flex-col gap-4">
      <UiFancyIcon
        v-if="page?.fancyIcon && page.fancyIcon.icon"
        :theme="page.fancyIcon.theme ?? 'modern-neue'"
        :color="page.fancyIcon.color ?? 'primary'"
        :size="page.fancyIcon.size ?? 'lg'"
        class="shrink-0 text-foreground/70"
        :icon="page.fancyIcon.icon"
      />
      <UiFancyIcon
        v-else-if="page?.navigation && page.navigation.icon && typeof page.navigation === 'object'"
        theme="modern-neue"
        size="lg"
        class="shrink-0 text-foreground/70"
        :icon="page.navigation.icon"
      />
      <div class="w-full grow">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <h1 class="text-4xl leading-none font-bold">{{ page?.title }}</h1>
          <PageHeaderLinks />
        </div>
        <p v-if="page?.description" class="mt-2 mb-4 text-lg text-muted-foreground">
          {{ page?.description }}
        </p>
        <div v-if="page?.links && page?.links?.length" class="not-prose mb-6 flex flex-wrap gap-2">
          <template v-for="(link, i) in page?.links" :key="i">
            <UiBadge
              :href="link?.href"
              target="_blank"
              variant="outline"
              size="md"
              class="transition-colors duration-300"
            >
              <Icon
                v-if="link?.icon"
                :name="link.icon"
                class="size-3.5 shrink-0 text-muted-foreground"
              />{{ link?.title }}
            </UiBadge>
          </template>
        </div>
      </div>
    </div>
    <UiDivider :type="isDashed ? 'dashed' : 'solid'" />
  </div>
</template>

<script lang="ts" setup>
  const { headline, page } = await useDocPage();
  const { isDashed } = useDocd();

  const hasFancyIcon = computed(() => {
    return (
      (page.value?.fancyIcon && page.value.fancyIcon.icon) ||
      (page.value?.navigation &&
        page.value.navigation.icon &&
        typeof page.value.navigation === "object")
    );
  });
</script>
