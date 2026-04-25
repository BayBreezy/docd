<script setup lang="ts">
  defineProps<{
    /**
     * URL displayed in the address bar.
     * @example "https://example.com"
     */
    url?: string;
  }>();

  const emit = defineEmits<{
    /**
     * Emitted when the close (red) traffic light button is clicked.
     */
    close: [];
    /**
     * Emitted when the minimize (yellow) traffic light button is clicked.
     */
    minimize: [];
    /**
     * Emitted when the maximize (green) traffic light button is clicked.
     */
    maximize: [];
    /**
     * Emitted when the sidebar/panel toggle button is clicked.
     */
    panel: [];
    /**
     * Emitted when the back navigation button is clicked.
     */
    back: [];
    /**
     * Emitted when the forward navigation button is clicked.
     */
    forward: [];
    /**
     * Emitted when the page refresh button is clicked.
     */
    refresh: [];
    /**
     * Emitted when the download button is clicked.
     */
    download: [];
    /**
     * Emitted when the share button is clicked.
     */
    share: [];
    /**
     * Emitted when the new tab button is clicked.
     */
    newTab: [];
    /**
     * Emitted when the copy button is clicked.
     */
    copy: [];
  }>();

  defineSlots<{
    /**
     * Replaces the three traffic light buttons (close, minimize, maximize).
     */
    "traffic-lights": () => void;
    /**
     * Replaces the sidebar panel toggle and back/forward navigation buttons.
     */
    "nav-controls": () => void;
    /**
     * Replaces the address bar area.
     */
    "address-bar": () => void;
    /**
     * Replaces the right-side action buttons (download, share, new tab, copy).
     */
    actions: () => void;
    /**
     * Content rendered inside the browser frame body.
     */
    default: () => void;
  }>();
</script>

<template>
  <div class="w-full overflow-hidden rounded-xl border shadow-md">
    <div class="flex items-center gap-3 border-b px-3 py-2">
      <!-- Traffic lights -->
      <div class="flex shrink-0 items-center gap-1.5">
        <slot name="traffic-lights">
          <button
            type="button"
            aria-label="Close"
            class="size-3 rounded-full bg-red-500 transition-opacity hover:opacity-80"
            @click="emit('close')"
          />
          <button
            type="button"
            aria-label="Minimize"
            class="size-3 rounded-full bg-yellow-400 transition-opacity hover:opacity-80"
            @click="emit('minimize')"
          />
          <button
            type="button"
            aria-label="Maximize"
            class="size-3 rounded-full bg-green-500 transition-opacity hover:opacity-80"
            @click="emit('maximize')"
          />
        </slot>
      </div>

      <!-- Panel + back/forward -->
      <div class="flex shrink-0 items-center gap-0.5">
        <slot name="nav-controls">
          <button
            type="button"
            aria-label="Toggle sidebar"
            class="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="emit('panel')"
          >
            <Icon name="lucide:panel-left" class="size-4" />
          </button>
          <button
            type="button"
            aria-label="Go back"
            class="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="emit('back')"
          >
            <Icon name="lucide:chevron-left" class="size-4" />
          </button>
          <button
            type="button"
            aria-label="Go forward"
            class="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="emit('forward')"
          >
            <Icon name="lucide:chevron-right" class="size-4" />
          </button>
        </slot>
      </div>

      <!-- Address bar -->
      <div class="flex min-w-0 flex-1 justify-center">
        <slot name="address-bar">
          <div
            class="flex w-full max-w-sm items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-xs text-muted-foreground dark:border-muted/50 dark:bg-muted/50"
          >
            <Icon name="lucide:shield" class="size-3 shrink-0" />
            <span class="min-w-0 flex-1 truncate text-center">{{ url ?? "about:blank" }}</span>
            <button
              type="button"
              aria-label="Refresh"
              class="shrink-0 transition-opacity hover:opacity-70"
              @click="emit('refresh')"
            >
              <Icon name="lucide:rotate-cw" class="size-3" />
            </button>
          </div>
        </slot>
      </div>

      <!-- Right-side actions -->
      <div class="flex shrink-0 items-center gap-0.5">
        <slot name="actions">
          <button
            type="button"
            aria-label="Download"
            class="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="emit('download')"
          >
            <Icon name="lucide:arrow-down-to-line" class="size-4" />
          </button>
          <button
            type="button"
            aria-label="Share"
            class="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="emit('share')"
          >
            <Icon name="lucide:share" class="size-4" />
          </button>
          <button
            type="button"
            aria-label="New tab"
            class="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="emit('newTab')"
          >
            <Icon name="lucide:plus" class="size-4" />
          </button>
          <button
            type="button"
            aria-label="Copy"
            class="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            @click="emit('copy')"
          >
            <Icon name="lucide:copy" class="size-4" />
          </button>
        </slot>
      </div>
    </div>

    <div>
      <slot mdc-unwrap="p" />
    </div>
  </div>
</template>
