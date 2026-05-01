<template>
  <nav class="flex flex-col gap-4 sm:text-sm">
    <!-- Non-nested: group consecutive flat items so each group gets a shared vertical line -->
    <template v-if="!nested">
      <template v-for="(group, gi) in groups" :key="gi">
        <!-- Flat group: vertical line + curves -->
        <div
          v-if="group.type === 'flat'"
          class="relative flex flex-col gap-4 pt-1 pl-8 before:absolute before:left-2 before:h-[calc(100%-23px)] before:w-px before:bg-border dark:before:bg-accent"
        >
          <div
            v-for="(item, i) in group.items"
            :key="i"
            class="relative flex items-center gap-4 first:mt-2"
          >
            <NuxtLink
              class="group line-clamp-1 flex shrink-0 items-center gap-2 text-base text-ellipsis text-muted-foreground sm:text-sm"
              :class="[
                'before:absolute before:-left-6 before:-mt-4 before:size-4 before:rounded-bl-md before:border-b before:border-l before:border-border dark:before:border-accent',
              ]"
              exact-active-class="text-primary"
              :to="item.path"
              :title="item.title"
              :target="item.target ? (item.target as string) : '_self'"
            >
              <Icon
                v-if="item.icon && typeof item.icon === 'string'"
                :name="item.icon"
                class="size-4"
              />
              <div class="relative">
                {{ item.title }}
                <div
                  class="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-primary to-transparent group-hover:scale-x-100"
                  :class="[
                    'transition-all duration-300',
                    route.path === item.path ? 'scale-x-100' : 'scale-x-0',
                  ]"
                ></div>
              </div>
            </NuxtLink>
            <UiBadge
              v-if="item.label"
              class="rounded-sm text-xs md:text-[10px] dark:bg-lime-600 dark:text-white"
              >{{ item.label }}</UiBadge
            >
          </div>
        </div>

        <!-- Collapsible item -->
        <UiCollapsible
          v-else
          :default-open="isDefaultOpen(group.item)"
          class="flex flex-col border-b pb-4"
          :class="[
            isDashed ? 'border-dashed' : '',
            gi > 0 && groups[gi - 1]?.type === 'flat' ? 'border-t pt-4' : '',
          ]"
        >
          <UiCollapsibleTrigger
            class="group inline-flex items-center gap-2 rounded-sm p-2 pl-2.5 text-foreground/70 transition-all duration-300 hover:bg-accent/50 hover:text-foreground/90 data-[state=open]:text-foreground/90"
          >
            <Icon
              v-if="group.item.icon && typeof group.item.icon === 'string'"
              :name="group.item.icon"
              class="size-4"
            />
            <p class="text-sm font-semibold">{{ group.item.title }}</p>
            <Icon
              name="lucide:chevron-down"
              class="ms-auto size-4 text-muted-foreground/50 transition-transform group-data-[state=open]:rotate-180"
            />
          </UiCollapsibleTrigger>

          <UiCollapsibleContent class="flex flex-col gap-1 pl-2">
            <div
              class="relative pt-1 pl-8 before:absolute before:left-2 before:h-[calc(100%-23px)] before:w-px before:bg-border dark:before:bg-accent"
            >
              <DocsNav
                class="gap-4 first:mt-2"
                :items="group.item.children!"
                :nested="true"
                :depth="(props.depth ?? 1) + 1"
              />
            </div>
          </UiCollapsibleContent>
        </UiCollapsible>
      </template>
    </template>

    <!-- Nested (inside a collapsible): parent already provides the vertical line, just render links -->
    <template v-for="(item, i) in items" v-else :key="i">
      <div class="relative flex items-center gap-4">
        <NuxtLink
          class="group line-clamp-1 flex shrink-0 items-center gap-2 text-base text-ellipsis text-muted-foreground sm:text-sm"
          :class="[
            'before:absolute before:-left-6 before:-mt-4 before:size-4 before:rounded-bl-md before:border-b before:border-l before:border-border dark:before:border-accent',
          ]"
          exact-active-class="text-primary"
          :to="item.path"
          :title="item.title"
          :target="item.target ? (item.target as string) : '_self'"
        >
          <Icon
            v-if="item.icon && typeof item.icon === 'string'"
            :name="item.icon"
            class="size-4"
          />
          <div class="relative">
            {{ item.title }}
            <div
              class="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-primary to-transparent group-hover:scale-x-100"
              :class="[
                'transition-all duration-300',
                route.path === item.path ? 'scale-x-100' : 'scale-x-0',
              ]"
            ></div>
          </div>
        </NuxtLink>
        <UiBadge
          v-if="item.label"
          class="rounded-sm text-xs md:text-[10px] dark:bg-lime-600 dark:text-white"
          >{{ item.label }}</UiBadge
        >
      </div>
    </template>
  </nav>
</template>
<script lang="ts" setup>
  import type { ContentNavigationItem } from "@nuxt/content";

  const props = defineProps<{
    items: ContentNavigationItem[];
    nested?: boolean;
    depth?: number;
  }>();

  const route = useRoute();
  const { isDashed } = useDocd();
  const expandNav = useUIConfig("expandNav");

  function isDefaultOpen(item: ContentNavigationItem): boolean {
    if (route.path.includes(item.path)) return true;
    const cfg = expandNav.value;
    const d = props.depth ?? 1;
    if (cfg === true) return true;
    if (typeof cfg === "number") return d <= cfg;
    if (Array.isArray(cfg)) return cfg.includes(d);
    return false;
  }

  type Group =
    | { type: "flat"; items: ContentNavigationItem[] }
    | { type: "collapsible"; item: ContentNavigationItem };

  // Group consecutive flat items together so they share one vertical line container.
  // Collapsible items (folders) stay as individual entries in their original order.
  const groups = computed<Group[]>(() => {
    const result: Group[] = [];
    let currentFlat: ContentNavigationItem[] = [];

    for (const item of props.items) {
      if (item.children) {
        if (currentFlat.length > 0) {
          result.push({ type: "flat", items: currentFlat });
          currentFlat = [];
        }
        result.push({ type: "collapsible", item });
      } else {
        currentFlat.push(item);
      }
    }
    if (currentFlat.length > 0) {
      result.push({ type: "flat", items: currentFlat });
    }
    return result;
  });
</script>
