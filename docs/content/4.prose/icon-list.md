---
title: Icon List
description: Display lists with custom icons and variants for each item.
links:
  - title: Source Code
    href: https://github.com/BayBreezy/docd/blob/main/docd/app/components/content/ProseIconList.global.vue
    icon: lucide:code-xml
publishedAt: 2026-04-24
modifiedAt: 2026-04-24
---

## Usage

### Mixed Variants

Each item can have its own variant:

::prose-show-case{prose}
  :::prose-icon-list

    ::prose-li{variant="success"}
    Feature is working correctly
    ::
    ::prose-li{variant="warning"}
    Needs further testing
    ::
    ::prose-li{variant="error"}
    Bug found in production
    ::
    ::prose-li{variant="info"}
    Documentation pending
    ::
  :::

#code

```mdc
  :::prose-icon-list

  ::prose-li{variant="success"}
  Feature is working correctly
  ::
  ::prose-li{variant="warning"}
  Needs further testing
  ::
  ::prose-li{variant="error"}
  Bug found in production
  ::
  ::prose-li{variant="info"}
  Documentation pending
  ::
:::
```
::

### Custom Icons

Override the default icons with custom ones:

:::prose-show-case{prose}
  ::prose-icon-list{icon="lucide:star"}
  Premium feature

  Advanced analytics

  Priority support
  ::

#code

```mdc
::prose-icon-list{icon="lucide:star"}
Premium feature

Advanced analytics

Priority support
::
```
:::

### Per-Item Custom Icons

Each item can have its own icon:


::prose-show-case{prose}
  :::prose-icon-list
    ::prose-li{icon="lucide:check-circle-2" variant="success"}
    Completed task
    ::
    ::prose-li{icon="lucide:clock" variant="warning"}
    In progress
    ::
    ::prose-li{icon="lucide:x-circle" variant="error"}
    Failed step
    ::
    ::prose-li{icon="lucide:help-circle" variant="info"}
    Needs clarification
    ::
  :::

#code

```mdc
:::prose-icon-list
    ::prose-li{icon="lucide:check-circle-2" variant="success"}
    Completed task
    ::
    ::prose-li{icon="lucide:clock" variant="warning"}
    In progress
    ::
    ::prose-li{icon="lucide:x-circle" variant="error"}
    Failed step
    ::
    ::prose-li{icon="lucide:help-circle" variant="info"}
    Needs clarification
    ::
  :::
```
::

## Variants

:::prose-show-case{prose}

### Success

  ::prose-icon-list{variant="success"}
  User registration completed

  Email verification sent

  Profile created successfully
  ::

### Error

  ::prose-icon-list{variant="error"}
  Invalid credentials provided

  Connection timeout

  File upload failed
  ::

### Warning

  ::prose-icon-list{variant="warning"}
  API rate limit approaching

  Deprecated feature in use

  Cache needs clearing
  ::

### Info

  ::prose-icon-list{variant="info"}
  Server maintenance scheduled

  New feature available

  Documentation updated
  ::

### Default

  ::prose-icon-list
  Standard list item

  Another item

  Final item
  ::

#code

```mdc
### Success

  ::prose-icon-list{variant="success"}
  User registration completed

  Email verification sent

  Profile created successfully
  ::

### Error

  ::prose-icon-list{variant="error"}
  Invalid credentials provided

  Connection timeout

  File upload failed
  ::

### Warning

  ::prose-icon-list{variant="warning"}
  API rate limit approaching

  Deprecated feature in use

  Cache needs clearing
  ::

### Info

  ::prose-icon-list{variant="info"}
  Server maintenance scheduled

  New feature available

  Documentation updated
  ::

### Default

  ::prose-icon-list
  Standard list item

  Another item

  Final item
  ::

```
:::
## Vue Component Usage

You can also use this as a regular Vue component:

```vue
<template>
  <ProseIconList variant="success">
    <ProseLi>Feature completed</ProseLi>
    <ProseLi>Tests passing</ProseLi>
    <ProseLi variant="warning">Review pending</ProseLi>
  </ProseIconList>
</template>
```

## Advanced Example

Combine different features for complex lists:

:::prose-icon-list{icon="lucide:package"}
  ::prose-li{icon="lucide:download" variant="success"}
  **Installation**: Run `npm install ui-thing`
    ::prose-icon-list{icon="lucide:check" variant="success"}
    Download the package

    Install the dependencies

    Go to the project directory
    ::
  ::
  ::prose-li{icon="lucide:settings" variant="info"}
  **Configuration**: Set up your `nuxt.config.ts`
  ::
  ::prose-li{icon="lucide:circle-play" variant="warning"}
  **Usage**: Import components as needed
  ::
  ::prose-li{icon="lucide:rocket" variant="success"}
  **Deploy**: Push to production
  ::
:::
