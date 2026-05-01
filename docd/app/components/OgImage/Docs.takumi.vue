<template>
  <div class="h-full w-full bg-zinc-950 p-20 text-zinc-50">
    <div
      class="relative flex h-full w-full flex-col justify-center gap-4 border border-zinc-900/80 bg-zinc-900/10 p-10"
    >
      <div class="absolute -top-px right-0 h-px w-12 bg-zinc-700" />
      <div class="absolute top-0 -right-px h-12 w-px bg-zinc-700" />
      <div class="absolute right-0 -bottom-px h-px w-12 bg-zinc-700" />
      <div class="absolute -right-px bottom-0 h-12 w-px bg-zinc-700" />

      <div class="absolute -top-px left-0 h-px w-12 bg-zinc-700" />
      <div class="absolute top-0 -left-px h-12 w-px bg-zinc-700" />
      <div class="absolute -bottom-px left-0 h-px w-12 bg-zinc-700" />
      <div class="absolute bottom-0 -left-px h-12 w-px bg-zinc-700" />

      <p v-if="headline" class="mb-4 text-2xl text-pretty whitespace-pre-line" v-html="headline" />
      <h1 v-if="title" class="mb-4 text-5xl leading-none font-bold tracking-tighter">
        {{ title }}
      </h1>
      <p
        v-if="description"
        class="text-3xl leading-normal text-pretty whitespace-pre-line opacity-80"
      >
        {{ description }}
      </p>

      <div v-if="logoSvg" class="absolute bottom-7 left-7 size-10" v-html="logoSvg" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    title?: string;
    description?: string;
    headline?: string;
  }>();

  const { darkLogo, lightLogo } = useDocd();
  const logoPath = darkLogo.value || lightLogo.value;

  const logoSvg = await fetchLogoSvg(logoPath);

  function resizeSvg(svg: string, size: number): string {
    const s = String(size);
    const withWidth = /width="[^"]*"/.test(svg)
      ? svg.replace(/width="[^"]*"/, `width="${s}"`)
      : svg.replace("<svg", `<svg width="${s}"`);
    return /height="[^"]*"/.test(withWidth)
      ? withWidth.replace(/height="[^"]*"/, `height="${s}"`)
      : withWidth.replace("<svg", `<svg height="${s}"`);
  }

  async function fetchLogoSvg(path?: string): Promise<string> {
    if (!path) return "";
    try {
      const { url: siteUrl } = useSiteConfig();
      const url = path.startsWith("http") ? path : `${siteUrl}${path}`;
      const svg = await $fetch<string>(url, { responseType: "text" });
      return resizeSvg(svg, 48);
    } catch {
      return "";
    }
  }
</script>
