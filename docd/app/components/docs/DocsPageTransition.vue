<template>
  <div
    class="w-full min-w-0 overflow-x-clip"
    :class="[isAnimating && 'pointer-events-none overflow-clip']"
  >
    <AnimatePresence mode="wait" @exit-complete="isAnimating = false">
      <Motion
        :key="route.path"
        :initial="preset.initial"
        :animate="animate"
        :exit="preset.exit"
        :transition="{ duration, ease: easing }"
        style="width: 100%; min-width: 0"
      >
        <slot />
      </Motion>
    </AnimatePresence>
  </div>
</template>

<script lang="ts" setup>
  const route = useRoute();
  const { preset, animate, duration, easing } = useDocd();

  const isAnimating = ref(false);
  watch(
    () => route.path,
    () => {
      isAnimating.value = true;
    }
  );
</script>
