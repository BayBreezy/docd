<template>
  <UiTooltip>
    <UiTooltipTrigger as-child>
      <UiButton
        variant="ghost"
        size="icon-xs"
        :aria-label="copied ? 'Copied' : 'Copy to clipboard'"
        :disabled="copied"
        v-bind="$attrs"
        @click="onCopy"
      >
        <AnimatePresence mode="wait">
          <Motion
            v-if="!copied"
            as-child
            as="svg"
            :initial="{ opacity: 0, scale: 0.8 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.8 }"
            :transition="{ duration: 0.2 }"
          >
            <Icon name="lucide:clipboard" aria-hidden="true" class="size-4 text-muted-foreground" />
          </Motion>
          <Motion
            v-if="copied"
            as-child
            as="svg"
            :initial="{ opacity: 0, scale: 0.8 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.8 }"
            :transition="{ duration: 0.2 }"
          >
            <Icon name="lucide:check" aria-hidden="true" class="size-4 text-emerald-500" />
          </Motion>
        </AnimatePresence>
      </UiButton>
    </UiTooltipTrigger>
    <UiTooltipContent>
      <p>Copy to clipboard</p>
      <UiTooltipArrow />
    </UiTooltipContent>
  </UiTooltip>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    /**
     * The code that should be copied
     */
    code?: string;
  }>();

  defineOptions({ inheritAttrs: false });

  const { copied, copy } = useClipboard();

  const emit = defineEmits<{
    codeCopied: [];
  }>();

  const onCopy = () => {
    if (!props.code) return;
    copy(props.code);
    useSonner("Copied to clipboard!");
    emit("codeCopied");
  };
</script>
