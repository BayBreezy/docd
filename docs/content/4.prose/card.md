---
title: Card
description: Display content in elegant cards with animated border beam effects, perfect for features, navigation, and content highlights.
links:
  - title: Source Code
    href: https://github.com/BayBreezy/docd/blob/main/docd/app/components/content/prose/ProseCard.global.vue
    icon: lucide:code-xml
publishedAt: 2026-04-24
modifiedAt: 2026-04-24
---

## Overview

The `ProseCard` component creates visually appealing cards with a subtle animated border beam effect on hover. Cards can be static content containers or interactive links, making them perfect for feature highlights, navigation menus, and content organization.

::prose-callout{variant="info" title="Features"}

- **Animated Border Beam** - Subtle glowing border animation on hover
- **Link Support** - Works as NuxtLink with `to` or `href` props
- **Flexible Slots** - Customize icon, title, description, and footer
- **Icon Support** - Built-in icon display
- **Accessible** - Semantic HTML structure with proper link handling
- **Customizable** - Add custom classes for additional styling

::

## Basic Usage

Create a simple card with title and description:

:::prose-show-case{prose}

  ::prose-card{title="Getting Started" description="Learn the basics of using this component library with step-by-step tutorials and examples."}
  ::

#code

```mdc
::prose-card{title="Getting Started" description="Learn the basics of using this component library with step-by-step tutorials and examples."}
::
```

:::

## With Icon

Add an icon to make cards more visually distinctive:

:::prose-show-case{prose}

  ::prose-card{icon="lucide:rocket" title="Quick Setup" description="Get up and running in minutes with our automated setup process and sensible defaults."}
  ::

#code

```mdc
::prose-card{icon="lucide:rocket" title="Quick Setup" description="Get up and running in minutes with our automated setup process and sensible defaults."}
::
```

:::

## As Link

Make cards clickable by adding a `to` or `href` prop. The card will render as a NuxtLink:

:::prose-show-case{prose}

  ::prose-card{to="/getting-started/introduction" icon="lucide:book-open" title="Documentation" description="Explore our comprehensive guides and API references."}
  ::

#code

```mdc
::prose-card{to="/getting-started/introduction" icon="lucide:book-open" title="Documentation" description="Explore our comprehensive guides and API references."}
::
```

:::

## External Link

Link to external URLs using the `href` prop:

:::prose-show-case{prose}

  ::prose-card{href="https://github.com" target="\_blank" icon="lucide:github" title="GitHub" description="View the source code and contribute to the project."}
  ::

#code

```mdc
::prose-card{href="https://github.com" target="_blank" icon="lucide:github" title="GitHub" description="View the source code and contribute to the project."}
::
```

:::

## With Markdown Content

Use the default slot for rich markdown content:

:::prose-show-case{prose}

  ::prose-card{icon="lucide:code" title="Developer Experience"}
  Built with modern tools and best practices:

  - TypeScript for type safety
  - Tailwind CSS for styling
  - Nuxt 3 for performance
  - Accessible by default

  Hover to see the animated border effect! ✨

  ::

#code

```mdc
::prose-card{icon="lucide:code" title="Developer Experience"}
Built with modern tools and best practices:

- TypeScript for type safety
- Tailwind CSS for styling
- Nuxt 3 for performance
- Accessible by default

Hover to see the animated border effect! ✨

::
```

:::

## Custom Title Slot

Override the title with custom markdown formatting:

:::prose-show-case{prose}

  ::prose-card{icon="lucide:sparkles"}

  Check out the latest updates including dark mode, improved animations, and better accessibility.

  #title

  [**New** in Version 2.0]

  ::

#code

```mdc
::prose-card{icon="lucide:sparkles"}

Check out the latest updates including dark mode, improved animations, and better accessibility.

#title

[**New** in Version 2.0]

::
```

:::

## With Footer Slot

Add additional content at the bottom of the card using the footer slot:

:::prose-show-case{prose}

  ::prose-card{icon="lucide:layout-dashboard" title="Dashboard Example" description="View a fully functional dashboard with charts, tables, and interactive components."}

  #footer
  [View Example →](/examples/dashboard){.text-sm}
  ::

#code

```mdc
::prose-card{icon="lucide:layout-dashboard" title="Dashboard Example" description="View a fully functional dashboard with charts, tables, and interactive components."}

#footer
[View Example →](/examples/dashboard){.text-sm}
::
```

:::

## Card Grid

Display multiple cards in a responsive grid layout:

:::prose-show-case{prose}

<div class="grid gap-4 sm:grid-cols-2">

  ::prose-card{to="/components" icon="lucide:zap" title="Fast Performance" description="Optimized for speed with lazy loading and tree-shaking support."}
  ::

  ::prose-card{to="/components" icon="lucide:shield-check" title="Type Safe" description="Full TypeScript support with comprehensive type definitions."}
  ::

  ::prose-card{to="/components" icon="lucide:palette" title="Themeable" description="Customizable with Tailwind CSS and CSS variables."}
  ::

  ::prose-card{to="/components" icon="lucide:accessibility" title="Accessible" description="WCAG compliant with proper ARIA attributes and keyboard navigation."}
  ::

  ::prose-card{to="/components" icon="lucide:package" title="Modular" description="Import only what you need with tree-shakeable components."}
  ::

  ::prose-card{to="/components" icon="lucide:book-open" title="Well Documented" description="Comprehensive guides with live examples and best practices."}
  ::

</div>

#code

```mdc
<div class="grid gap-4 sm:grid-cols-2">

::prose-card{to="/components" icon="lucide:zap" title="Fast Performance" description="Optimized for speed with lazy loading and tree-shaking support."}
::

::prose-card{to="/components" icon="lucide:shield-check" title="Type Safe" description="Full TypeScript support with comprehensive type definitions."}
::

::prose-card{to="/components" icon="lucide:palette" title="Themeable" description="Customizable with Tailwind CSS and CSS variables."}
::

::prose-card{to="/components" icon="lucide:accessibility" title="Accessible" description="WCAG compliant with proper ARIA attributes and keyboard navigation."}
::

::prose-card{to="/components" icon="lucide:package" title="Modular" description="Import only what you need with tree-shakeable components."}
::

::prose-card{to="/components" icon="lucide:book-open" title="Well Documented" description="Comprehensive guides with live examples and best practices."}
::

</div>
```

:::

## Feature Showcase

Highlight key features with rich content:

:::prose-show-case{prose}

<div class="grid gap-6 md:grid-cols-2">

  ::prose-card{icon="lucide:layout-dashboard"}

  Pre-built dashboard components for quick prototyping:

  - Charts and graphs
  - Data tables
  - Statistics cards
  - Activity feeds

  [View Examples →](/examples/dashboard)

  #title

  #### Dashboard Components

  ::

  ::prose-card{icon="lucide:form-input"}

  Everything you need for complex forms:

  - Input validation
  - File uploads
  - Date pickers
  - Multi-select

  [View Components →](/components/form)

  #title

  #### Form Components

  ::

</div>

#code

```mdc
<div class="grid gap-6 md:grid-cols-2">

::prose-card{icon="lucide:layout-dashboard"}

Pre-built dashboard components for quick prototyping:

- Charts and graphs
- Data tables
- Statistics cards
- Activity feeds

[View Examples →](/examples/dashboard)

#title

#### Dashboard Components

::

::prose-card{icon="lucide:form-input"}

Everything you need for complex forms:

- Input validation
- File uploads
- Date pickers
- Multi-select

[View Components →](/components/form)

#title

#### Form Components

::

</div>
```

:::

## Use Cases

::prose-callout{variant="tip" title="Perfect For"}

- **Feature Highlights** - Showcase product features with icons and descriptions
- **Navigation Menus** - Create engaging navigation with linked cards
- **Resource Links** - Direct users to guides, examples, or external resources
- **Documentation Sections** - Organize docs into clickable category cards
- **Service Listings** - Display services or offerings in an attractive grid
- **Call-to-Actions** - Highlight important actions or pages
- **Content Previews** - Teasers for articles, examples, or pages

::
