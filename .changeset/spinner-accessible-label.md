---
"@felleslosninger/minid-elements": patch
---

Give `mid-spinner` an accessible name, and use it in `mid-button`'s loading state

### New features and fixes

- `mid-spinner` has a new optional `label` property that renders visually hidden text describing what is loading. The animated SVG is now `aria-hidden="true"` so it is no longer announced as an unlabelled graphic. Previously `mid-spinner` had no accessible name or role at all, so a loading state shown only by a spinner was conveyed to sighted users alone.
- `mid-button` now passes a translated loading string to its spinner when `loading` is set without `loadingtext`. With `loadingtext` the visible text still provides the name, so the spinner stays unlabelled and nothing is announced twice.
- `ComponentTranslations` has a new `loading` key (nb, nn, se, en), overridable through `setTranslations`.

`label` is an accessible *name*, not a status message — consumers whose loading state changes over time (waiting → done → failed) still need their own `role="status"`/`aria-live` region, since a name change does not announce.
