<template>
  <ClientOnly>
    <nav class="flex flex-col gap-2 text-sm">
      <template v-for="(l, i) in links" :key="i">
        <NuxtLink
          v-if="!l.children"
          data-toc-link="true"
          :data-depth="l.depth"
          class="data-[active=true]:decoration-muted-primary line-clamp-1 text-muted-foreground transition-all hover:text-primary data-[active=true]:text-primary"
          :title="l.text"
          :style="{ marginLeft: `${l.depth > 2 ? l.depth * 2 : 0}${isMobile ? 'px' : '%'}` }"
          :to="`#${l.id}`"
          :data-scrollspy-anchor="l.id"
        >
          {{ l.text }}
        </NuxtLink>

        <div v-else class="flex flex-col gap-2 text-sm">
          <NuxtLink
            data-toc-link="true"
            :data-depth="l.depth"
            class="data-[active=true]:decoration-muted-primary line-clamp-1 text-muted-foreground transition-all hover:text-primary data-[active=true]:text-primary"
            :title="l.text"
            :to="`#${l.id}`"
            :data-scrollspy-anchor="l.id"
          >
            {{ l.text }}
          </NuxtLink>

          <DocsToclink :links="l.children" />
        </div>
      </template>
    </nav>
  </ClientOnly>
</template>

<script lang="ts" setup>
  import { breakpointsTailwind } from "@vueuse/core";
  type Toclink = {
    text: string;
    id: string;
    depth: number;
    children?: Toclink[];
  };

  defineProps<{
    links: Toclink[];
  }>();

  const bp = useBreakpoints(breakpointsTailwind);
  const isMobile = bp.smaller("xl");
</script>
