---
'@felleslosninger/minid-elements': patch
---

Add color variants to `mid-validation-message`; accessibility improvements in `mid-textfield`

### New features and fixes

- `mid-validation-message` has a new `color` property (`danger` | `success` | `warning` | `info`) that controls icon, text color, and `aria-live` behavior. Defaults to `danger` for backwards compatibility
- `mid-textfield` description element now uses `aria-hidden="true"` instead of a `data-field` attribute; removed stray `data-field` from validation paragraph
