<template>
  <UiCommandDialog :key="dialogKey" v-model:open="searchModal" show-close-button highlight-on-hover>
    <UiDialogTitle class="sr-only">Documentation search modal</UiDialogTitle>
    <UiDialogDescription class="sr-only">
      Search the documentation for components, utilities, and more.
    </UiDialogDescription>

    <UiCommandInput placeholder="Search..." @update:model-value="updateSearchTerm" />

    <UiCommandList>
      <UiCommandEmpty>No results found.</UiCommandEmpty>
      <UiCommandGroup v-if="contentResults.length" heading="Content">
        <UiCommandItem
          v-for="section in contentResults"
          :key="section.id"
          class="items-start px-3 py-2"
          :value="section.id"
          @select="
            $event.preventDefault();
            navigateTo(section.id);
            searchModal = false;
          "
        >
          <Icon
            :name="section.id.includes('#') ? 'lucide:heading' : 'lucide:file-text'"
            class="mt-0.5 size-4 shrink-0 text-muted-foreground/70"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate font-medium text-foreground">{{ section.title }}</p>
            <p v-if="getSectionContext(section)" class="truncate text-xs text-muted-foreground">
              {{ getSectionContext(section) }}
            </p>
            <p v-if="section.content" class="line-clamp-2 text-xs text-muted-foreground">
              {{ getSectionSnippet(section.content) }}
            </p>
            <span class="sr-only">
              {{ section.title }} {{ section.titles.join(" ") }} {{ section.content }}
              {{ section.id }}
            </span>
          </div>
        </UiCommandItem>
      </UiCommandGroup>

      <UiCommandSeparator v-if="contentResults.length" />

      <template v-for="(nav, i) in navigation" :key="i">
        <!-- Nav item with children → group -->
        <UiCommandGroup v-if="nav.children?.length" :heading="nav.title">
          <UiCommandItem
            v-for="(child, k) in nav.children"
            :key="k"
            class="px-3 py-2"
            :value="child.title"
            @select="
              $event.preventDefault();
              navigateTo(child.path);
              searchModal = false;
            "
          >
            <Icon
              :name="(child.icon as string) || (nav.icon as string) || 'lucide:file-text'"
              class="size-4 shrink-0 text-muted-foreground/70"
            />
            <span class="flex-1 truncate">{{ child.title }}</span>
            <UiBadge
              v-if="(child as any).label"
              variant="outline"
              class="ml-2 shrink-0 px-1.5 py-0 text-[10px] dark:bg-lime-500/20 dark:text-lime-400"
              >{{ (child as any).label }}</UiBadge
            >
          </UiCommandItem>
        </UiCommandGroup>

        <!-- Nav item without children → flat link -->
        <UiCommandGroup v-else class="py-0">
          <UiCommandItem
            class="px-3 py-2"
            :value="nav.title"
            @select="
              $event.preventDefault();
              navigateTo(nav.path);
              searchModal = false;
            "
          >
            <Icon name="lucide:link" class="size-4 shrink-0 text-muted-foreground/70" />
            <span class="flex-1 truncate">{{ nav.title }}</span>
            <UiBadge
              v-if="(nav as any).label"
              variant="outline"
              class="ml-2 shrink-0 px-1.5 py-0 text-[10px] dark:bg-lime-500/20 dark:text-lime-400"
              >{{ (nav as any).label }}</UiBadge
            >
          </UiCommandItem>
        </UiCommandGroup>
      </template>

      <UiCommandSeparator />

      <UiCommandGroup heading="Theme">
        <UiCommandItem
          v-for="(mode, i) in modes"
          :key="i"
          class="px-3 py-2"
          :value="mode.value"
          @select="setTheme($event, mode.value)"
        >
          <Icon :name="mode.icon" class="size-4 shrink-0 text-muted-foreground/70" />
          <span>{{ mode.title }}</span>
        </UiCommandItem>
      </UiCommandGroup>
    </UiCommandList>

    <UiCommandFooter />
  </UiCommandDialog>
</template>

<script lang="ts" setup>
  import type { DocSearchSection } from "../../composables/useDocSearch";

  const modes = [
    { icon: "lucide:sun", title: "Light", value: "light" },
    { icon: "lucide:moon", title: "Dark", value: "dark" },
    { icon: "lucide:laptop", title: "System", value: "system" },
  ];

  const { navigation } = await useDocPage();
  const { data: searchSections } = useDocSearchSections();
  const searchModal = useSearchModal();
  const colorMode = useColorMode();
  const searchTerm = ref("");
  const dialogKey = ref(0);

  const setTheme = (e: Event, val: string) => {
    e.preventDefault();
    colorMode.preference = val;
    searchModal.value = false;
  };

  const updateSearchTerm = (value: string | number | undefined) => {
    searchTerm.value = `${value ?? ""}`;
  };

  const searchTokens = computed(() =>
    searchTerm.value
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(Boolean)
  );

  function scoreSection(section: DocSearchSection, tokens: string[]) {
    if (!tokens.length) return 0;

    const title = section.title.toLowerCase();
    const headings = section.titles.join(" ").toLowerCase();
    const content = section.content.toLowerCase();
    const id = section.id.toLowerCase();

    let score = 0;
    for (const token of tokens) {
      let tokenScore = 0;

      if (title.includes(token)) tokenScore = Math.max(tokenScore, 6);
      if (headings.includes(token)) tokenScore = Math.max(tokenScore, 4);
      if (id.includes(token)) tokenScore = Math.max(tokenScore, 3);
      if (content.includes(token)) tokenScore = Math.max(tokenScore, 2);

      if (!tokenScore) return 0;
      score += tokenScore;
    }

    if (!section.id.includes("#")) score += 1;
    return score;
  }

  const contentResults = computed(() => {
    if (!searchTokens.value.length) return [];

    return [...(searchSections.value ?? [])]
      .map((section) => ({ section, score: scoreSection(section, searchTokens.value) }))
      .filter((entry) => entry.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          a.section.level - b.section.level ||
          a.section.title.localeCompare(b.section.title)
      )
      .slice(0, 30)
      .map((entry) => entry.section);
  });

  function getSectionContext(section: DocSearchSection) {
    if (section.titles.length) return section.titles.join(" / ");
    const path = section.id.split("#")[0] || "";
    return path.replace(/^\//, "").replace(/\//g, " / ");
  }

  function getSectionSnippet(content: string) {
    const cleaned = content.replace(/\s+/g, " ").trim();
    return cleaned.length > 160 ? `${cleaned.slice(0, 157)}...` : cleaned;
  }

  const { meta_k } = useMagicKeys();
  watch(
    () => meta_k?.value,
    (val) => {
      if (val) {
        searchModal.value = !searchModal.value;
      }
    }
  );

  watch(searchModal, (open) => {
    if (!open) {
      searchTerm.value = "";
      dialogKey.value += 1;
    }
  });
</script>
