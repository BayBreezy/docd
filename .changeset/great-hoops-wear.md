---
"@baybreezy/docd": patch
---

Remove auto-injection of component API blocks for built-in prose components

Previously, the layer automatically appended component API sections (props, slots, events, exposed) to docs pages under `4.prose/**` based on a built-in registry and filename convention fallback. This caused unwanted component API blocks to appear in apps that extend the layer.

The auto-injection logic has been removed entirely. Component API blocks are now only rendered when explicitly declared in a page's front matter via the `componentApi` field. The metadata generation and runtime renderers (`ProseComponentApi`, `ProseComponentProps`, etc.) remain fully functional for explicit usage.
