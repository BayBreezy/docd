<template>
  <ClientOnly>
    <UiContextMenu v-if="contextMenuItems.length">
      <UiContextMenuTrigger as-child>
        <NuxtLink :to="logoUrl" class="flex min-w-0 items-center gap-2 py-4">
          <NuxtImg
            v-if="activeDisplayUrl"
            :src="activeDisplayUrl"
            :alt="logoAlt"
            :class="[
              isWordmarkDisplay
                ? 'h-6 w-auto shrink-0'
                : 'size-6 shrink-0 rounded ring-1 ring-border/80',
              logoClasses,
            ]"
          />
          <span v-if="showTitle" class="truncate font-extrabold">{{ headerTitle }}</span>
        </NuxtLink>
      </UiContextMenuTrigger>

      <UiContextMenuContent :collision-padding="10" translucent>
        <template v-for="(group, groupIndex) in contextMenuItems" :key="groupIndex">
          <UiContextMenuGroup>
            <UiContextMenuItem
              v-for="action in group"
              :key="action.label"
              @select="action.action()"
            >
              <Icon :name="action.icon" class="size-4" />
              <span>{{ action.label }}</span>
            </UiContextMenuItem>
          </UiContextMenuGroup>
          <UiContextMenuSeparator v-if="groupIndex < contextMenuItems.length - 1" />
        </template>
      </UiContextMenuContent>
    </UiContextMenu>

    <NuxtLink v-else :to="logoUrl" class="flex min-w-0 items-center gap-2 py-4">
      <NuxtImg
        v-if="activeDisplayUrl"
        :src="activeDisplayUrl"
        :alt="logoAlt"
        :class="[
          isWordmarkDisplay
            ? 'h-6 w-auto shrink-0'
            : 'size-6 shrink-0 rounded ring-1 ring-border/80',
          logoClasses,
        ]"
      />
      <span v-if="showTitle" class="truncate font-extrabold">{{ headerTitle }}</span>
    </NuxtLink>

    <template #fallback>
      <div class="flex min-w-0 items-center gap-2 py-4">
        <UiSkeleton class="size-6 shrink-0 rounded" />
        <UiSkeleton class="h-5 w-20 rounded" />
      </div>
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
  const { headerTitle, logoUrl } = useDocd();
  const {
    activeDisplayUrl,
    contextMenuItems,
    hasWordmark,
    isWordmarkDisplay,
    logoAlt,
    logoClasses,
  } = useLogoAssets();

  const showTitle = computed(() => !isWordmarkDisplay.value || !hasWordmark.value);
</script>
