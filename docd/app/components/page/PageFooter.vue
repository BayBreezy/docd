<template>
  <div class="not-prose @container mt-10 py-10">
    <div class="grid grid-cols-1 gap-5 @min-[600px]:grid-cols-2">
      <NuxtLink
        v-if="prev"
        :to="prev.path"
        class="flex gap-4 rounded-md border p-5 transition hover:border-primary"
        :class="isDashed ? 'border-dashed' : ''"
      >
        <UiFancyIcon
          theme="modern-neue"
          icon="lucide:arrow-left"
          size="md"
          class="text-foreground/80"
        />
        <div class="flex flex-col gap-1">
          <p class="font-semibold lg:text-sm">{{ prev.title }}</p>
          <p class="line-clamp-2 text-[15px] text-ellipsis text-muted-foreground lg:text-sm">
            {{ prev.description }}
          </p>
        </div>
      </NuxtLink>
      <NuxtLink
        v-if="next"
        :to="next.path"
        class="flex justify-between gap-4 rounded-md border p-5 transition hover:border-primary"
        :class="isDashed ? 'border-dashed' : ''"
      >
        <div class="flex flex-col gap-1">
          <p class="font-semibold lg:text-sm">{{ next.title }}</p>
          <p class="line-clamp-2 text-[15px] text-ellipsis text-muted-foreground lg:text-sm">
            {{ next.description }}
          </p>
        </div>
        <UiFancyIcon
          theme="modern-neue"
          icon="lucide:arrow-right"
          size="md"
          class="text-foreground/80"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const { prev, next } = await useDocPage();
  const { isDashed } = useDocd();
</script>
