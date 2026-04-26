---
"@baybreezy/docd": patch
---

Update some doc components and change how defaults are assigned in the config module.

- DocsGithubLink: Remove dark mode text color class.
- DocsThemeCustomizer: Add a fallback for the popover trigger.
- DocsThemeToggler: Add a fallback for the theme icon.
- Use `defu` in the config module to ensure that user-provided config values are merged with defaults rather than replaced.
