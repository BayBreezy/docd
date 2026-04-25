---
title: Images
description: How to use images in your content with zoom and styling options.
links:
  - title: Source Code
    href: https://github.com/BayBreezy/docd/blob/main/docd/app/components/content/ProseImg.global.vue
    icon: lucide:code-xml
publishedAt: 2026-04-24
modifiedAt: 2026-04-24
---

## Images

::prose-show-case

![Wedding table decoration by @madyevents](https://images.unsplash.com/photo-1758810742974-b92459867642?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340)

#code

```mdc
![Wedding table decoration by @madyevents](https://images.unsplash.com/photo-1758810742974-b92459867642?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340)
```

::

### Lifted Image

A lifted image is an image that has border and shadow, making it stand out more.

::prose-show-case

![Building in Japan](https://images.unsplash.com/photo-1759899564526-ed590258cb4d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987){lifted .h-[450px]}

#code

```mdc
![Building in Japan](https://images.unsplash.com/photo-1759899564526-ed590258cb4d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987){lifted .h-[450px]}
```

::

## Color Mode Image

A color mode image is an image that changes based on the current color mode (light or dark). This is useful for images that have different colors in light and dark mode.

::prose-show-case

  ::prose-color-mode-image{srcLight='https://images.unsplash.com/photo-1738739907433-10601360cee3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340' srcDark='https://images.unsplash.com/photo-1759915995368-cfd7dfa44b50?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340' alt='Color Mode Image'}

  ::

#code

```mdc
::prose-color-mode-image{srcLight='https://images.unsplash.com/photo-1738739907433-10601360cee3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340' srcDark='https://images.unsplash.com/photo-1759915995368-cfd7dfa44b50?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340' alt='Color Mode Image'}
```

::

## Embeds

::prose-show-case

:iframe{src="https://www.youtube.com/embed/1CzWALKazdQ?si=wn2HvIx7pWsGSiKv" class="rounded-md" title="How To Add Pinia To Your Nuxt 3 Application" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="aspect-ratio: 16/9;"}

#code

```mdc
:iframe{src="https://www.youtube.com/embed/1CzWALKazdQ?si=wn2HvIx7pWsGSiKv" class="rounded-md" title="How To Add Pinia To Your Nuxt 3 Application" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="aspect-ratio: 16/9;"}
```

::
