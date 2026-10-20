---
"@baybreezy/docd": patch
---

Fix the native `<select>` dropdown rendering white in dark mode on Windows and Linux Chromium. Removed the global `select` background rules, which overrode `UiNativeSelect` and left the popup without an opaque background.
