<template>
  <UiButtonGroup>
    <UiTooltip>
      <UiTooltipTrigger as-child>
        <UiButton variant="secondary" size="sm" :disabled="copied" @click="copyPage()">
          <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="size-3.5" />
          <span class="sr-only">{{ copied ? "Copied!" : "Copy Page" }}</span>
        </UiButton>
      </UiTooltipTrigger>
      <UiTooltipContent side="bottom">
        <p class="text-center">
          {{
            copied
              ? "Markdown link copied to clipboard!"
              : "Copy the markdown link for this page to your clipboard."
          }}
        </p>
      </UiTooltipContent>
    </UiTooltip>
    <UiButtonGroupSeparator />
    <UiTooltip>
      <UiDropdownMenu>
        <UiTooltipTrigger as-child>
          <UiDropdownMenuTrigger as-child>
            <UiButton variant="secondary" size="icon-sm">
              <Icon name="lucide:chevron-down" />
              <span class="sr-only">More options for header links </span>
            </UiButton>
          </UiDropdownMenuTrigger>
        </UiTooltipTrigger>
        <UiTooltipContent side="bottom">
          <p class="text-center">More options for this page</p>
        </UiTooltipContent>
        <UiDropdownMenuContent align="end" :collision-padding="10" class="w-60" translucent>
          <UiDropdownMenuGroup class="flex flex-col gap-0.5">
            <template v-for="(item, i) in items" :key="i">
              <UiDropdownMenuItem
                v-if="item.action"
                :icon="item.icon"
                :title="item.label"
                @select="item.action()"
              />
              <UiDropdownMenuItem v-else-if="item.to" :text-value="item.label" as-child>
                <NuxtLink
                  :to="item.to"
                  target="_blank"
                  class="flex w-full cursor-pointer items-center gap-2"
                >
                  <Icon :name="item.icon" />
                  <p v-html="item.label" />
                  <Icon name="lucide:arrow-up-right" class="ml-auto text-muted-foreground" />
                </NuxtLink>
              </UiDropdownMenuItem>
              <UiDropdownMenuSeparator v-else-if="item.separator" />
            </template>
          </UiDropdownMenuGroup>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </UiTooltip>
  </UiButtonGroup>
</template>

<script lang="ts" setup>
  const route = useRoute();
  const appBaseURL = useRuntimeConfig().app?.baseURL || "/";

  const { copy, copied } = useClipboard();
  const markdownLink = computed(() => `${window?.location?.origin}/raw${route.path}.md`);
  const mcpServerUrl = computed(() => `${window?.location?.origin}${appBaseURL}mcp`);

  const copyPage = async () => {
    try {
      const response = await $fetch<string>(`/raw/${route.path}.md`);
      if (response) {
        copy(response);
        useSonner.success("Markdown Link Copied", {
          description: "The markdown link for this page has been copied to your clipboard.",
        });
      }
    } catch {
      useSonner.error("Link Unavailable", {
        description: "This page does not have a markdown link available.",
      });
    }
  };

  const items = [
    {
      label: "Copy Markdown Link",
      icon: "lucide:link",
      action: () => {
        copy(markdownLink.value);
      },
    },
    {
      label: "Copy MCP Server URL",
      icon: "lucide:cpu",
      action: () => {
        copy(mcpServerUrl.value);
        useSonner.success("MCP URL Copied", {
          description: "The MCP server URL has been copied to your clipboard.",
        });
      },
    },
    { separator: true },
    {
      label: "View Markdown Page",
      icon: "simple-icons:markdown",
      to: `/raw${route.path}.md`,
    },
    {
      label: "Open in ChatGPT",
      icon: "simple-icons:openai",
      to: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(`Read ${markdownLink.value} so I can ask questions about it.`)}`,
    },
    {
      label: "Open in Claude",
      icon: "simple-icons:claude",
      to: `https://claude.ai/new?q=${encodeURIComponent(`Read ${markdownLink.value} so I can ask questions about it.`)}`,
    },
    {
      label: "Open in T3",
      icon: "lucide:message-circle",
      to: `https://t3.chat/new?q=${encodeURIComponent(`Read ${markdownLink.value} so I can ask questions about it.`)}`,
    },
    { separator: true },
    {
      label: `View llms.txt File`,
      icon: "lucide:bot",
      to: `/llms.txt`,
    },
    {
      label: `View llms-full.txt File`,
      icon: "lucide:bot",
      to: `/llms-full.txt`,
    },
  ];
</script>
