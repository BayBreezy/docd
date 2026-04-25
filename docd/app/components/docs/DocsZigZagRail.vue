<template>
  <div class="absolute inset-s-0 top-0 rtl:-scale-x-100" :style="containerStyle">
    <div class="absolute inset-0 bg-foreground/20" :style="trackMaskStyle" />

    <div class="absolute inset-0" :style="segmentMaskStyle">
      <div
        v-for="(segment, index) in props.segments"
        :key="index"
        class="absolute w-full bg-primary transition-[top,height] duration-200 ease-out"
        :style="{ top: `${segment.top}px`, height: `${segment.height}px` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";

  type RailSegment = {
    top: number;
    height: number;
  };

  const props = withDefaults(
    defineProps<{
      height: number;
      pathD: string;
      segments: RailSegment[];
      width?: number;
      dashed?: boolean;
    }>(),
    { width: 12, dashed: false }
  );

  function buildMaskUrl(dashed: boolean) {
    const h = Math.max(1, Math.round(props.height));
    const dashAttr = dashed ? ` stroke-dasharray="3 3"` : "";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${props.width} ${h}">
    <path d="${props.pathD}" stroke="black" stroke-width="1" fill="none"${dashAttr}/>
  </svg>`;

    const encoded = encodeURIComponent(svg)
      .replace(/%20/g, " ")
      .replace(/%3D/g, "=")
      .replace(/%3A/g, ":")
      .replace(/%2F/g, "/")
      .replace(/%2C/g, ",");

    return `url("data:image/svg+xml,${encoded}")`;
  }

  function maskStyle(dashed: boolean) {
    return {
      WebkitMaskImage: buildMaskUrl(dashed),
      maskImage: buildMaskUrl(dashed),
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
    };
  }

  const containerStyle = computed(() => ({
    width: `${props.width}px`,
    height: `${props.height}px`,
  }));

  const trackMaskStyle = computed(() => maskStyle(props.dashed));
  const segmentMaskStyle = computed(() => maskStyle(false));
</script>
