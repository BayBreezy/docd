<template>
  <nav v-if="allLinks.length" class="flex flex-col gap-2 text-sm">
    <NuxtLink
      v-for="(link, i) in allLinks"
      :key="i"
      :title="link.label"
      :href="link.href"
      :target="link.external ? '_blank' : '_self'"
      :external="link.external"
      class="flex items-center gap-2 text-muted-foreground transition-all hover:text-foreground"
    >
      <Icon :name="link.icon" />
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>

<script lang="ts" setup>
  const { github, extraLinks } = useDocd();
  const { page } = await useDocPage();

  const editLink = computed(() => {
    if (!github.value?.repo || !page.value?.stem) return null;
    const branch = github.value.branch ?? "main";
    const contentDir = github.value.contentDir ?? "content";
    return {
      icon: "lucide:pen",
      label: "Edit this page",
      href: `${github.value.repo}/edit/${branch}/${contentDir}/${page.value.stem}.md`,
      external: true,
    };
  });

  const allLinks = computed(() =>
    [editLink.value, ...extraLinks.value].filter(
      (l): l is NonNullable<typeof l> => l !== null && l !== undefined
    )
  );
</script>
