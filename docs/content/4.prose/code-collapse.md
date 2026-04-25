---
title: Code Collapse
description: A collapsible code block wrapper, perfect for showing long code examples without overwhelming your documentation.
links:
  - title: Source Code
    href: https://github.com/BayBreezy/docd/blob/main/docd/app/components/content/prose/ProseCodeCollapse.global.vue
    icon: lucide:code-xml
publishedAt: 2026-04-24
modifiedAt: 2026-04-24
---

## Overview

The `ProseCodeCollapse` component wraps code blocks and provides a toggle button to expand or collapse content. It's ideal for lengthy code examples that would take up too much vertical space, starting at a fixed height with a gradient fade effect.

::prose-callout{variant="info" title="Features"}

- **Clean Toggle** - Simple expand/collapse functionality
- **Gradient Fade** - Visual indicator when content is collapsed
- **Customizable Labels** - Configure button text and labels
- **Accessible** - Proper ARIA attributes for screen readers
- **Smart Defaults** - Works great out of the box with sensible defaults

::

## Basic Usage

Wrap any code block to make it collapsible:

:::prose-show-case{prose}

  ::prose-code-collapse
    :::prose-code-snippet{file="/app.config.ts" language="ts" title="/app.config.ts"}
    :::
  ::

#code

```mdc
  ::prose-code-collapse
    ::prose-code-snippet{file="/app.config.ts" language="ts" title="App Configuration"}
    ::
  ::
```

:::

## Custom Labels

Customize the button text and name:

:::prose-show-case{prose}

  ::prose-code-collapse{name="Implementation" openText="Show" closeText="Hide"}

  ```vue
  <script setup lang="ts">
    import { computed, ref } from "vue";
    import type { User } from "@/types";

    const users = ref<User[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const activeUsers = computed(() => users.value.filter((u) => u.role !== "guest"));

    const totalUsers = computed(() => users.value.length);

    async function fetchUsers() {
      loading.value = true;
      error.value = null;

      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch");
        users.value = await response.json();
      } catch (e) {
        error.value = e instanceof Error ? e.message : "Unknown error";
      } finally {
        loading.value = false;
      }
    }

    async function deleteUser(id: string) {
      try {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        users.value = users.value.filter((u) => u.id !== id);
      } catch (e) {
        console.error("Delete failed:", e);
      }
    }

    onMounted(() => {
      fetchUsers();
    });
  </script>

  <template>
    <div class="user-manager">
      <h2>Users ({{ totalUsers }})</h2>

      <div v-if="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="user-grid">
        <UserCard v-for="user in activeUsers" :key="user.id" :user="user" @delete="deleteUser" />
      </div>
    </div>
  </template>
  ```

  ::

#code

````mdc
::prose-code-collapse{name="Implementation" openText="Show" closeText="Hide"}

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import type { User } from "@/types";

const users = ref<User[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const activeUsers = computed(() => users.value.filter((u) => u.role !== "guest"));

const totalUsers = computed(() => users.value.length);

async function fetchUsers() {
loading.value = true;
error.value = null;

try {
const response = await fetch("/api/users");
if (!response.ok) throw new Error("Failed to fetch");
users.value = await response.json();
} catch (e) {
error.value = e instanceof Error ? e.message : "Unknown error";
} finally {
loading.value = false;
}
}

async function deleteUser(id: string) {
try {
await fetch(`/api/users/${id}`, { method: "DELETE" });
users.value = users.value.filter((u) => u.id !== id);
} catch (e) {
console.error("Delete failed:", e);
}
}

onMounted(() => {
fetchUsers();
});
</script>

<template>
<div class="user-manager">
<h2>Users ({{ totalUsers }})</h2>

<div v-if="loading">Loading...</div>
<div v-else-if="error" class="error">{{ error }}</div>
<div v-else class="user-grid">
<UserCard v-for="user in activeUsers" :key="user.id" :user="user" @delete="deleteUser" />
</div>
</div>
</template>
```

::

````

:::

## With Code Snippet

Combine with `::prose-code-snippet` to show actual source files:

:::prose-show-case{prose}

  ::prose-code-collapse{name="Full Source"}
    :::prose-code-snippet{file="/components/content/BrowserFrame.global.vue" language="vue" title="BrowserFrame Component"}
    :::
  ::

#code

```mdc
  ::prose-code-collapse{name="Full Source"}
    ::prose-code-snippet{file="/components/content/BrowserFrame.global.vue" language="vue" title="BrowserFrame Component"}
    ::
  ::
```

:::

## Custom Icon

Change the toggle icon:

:::prose-show-case{prose}

  ::prose-code-collapse{icon="lucide:code" name="Example"}
    ::prose-code-snippet{file="/components/content/BrowserFrame.global.vue" language="vue" title="BrowserFrame Component"}
    ::
  ::

#code

```mdc
  ::prose-code-collapse{icon="lucide:code" name="Example"}
    ::prose-code-snippet{file="/components/content/BrowserFrame.global.vue" language="vue" title="BrowserFrame Component"}
    ::
  ::
```

:::

## Behavior

### Initial State

- Code starts **collapsed** at 200px height
- Gradient fade overlay indicates more content below
- Button shows: "{openText} {name}" (e.g., "Expand Code")

### Expanded State

- Code expands to full height (max 80vh)
- Gradient fade removed
- Button shows: "{closeText} {name}" (e.g., "Collapse Code")
