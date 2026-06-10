---
'@felleslosninger/minid-elements': patch
---

Add alertdialog support to `mid-dialog`; add type mismatch validation to `mid-textfield`

### Fixes and improvements

- `mid-dialog` has a new `alertdialog` boolean attribute that switches the dialog role to `alertdialog` and focuses it on open, for blocking dialogs requiring immediate user attention
- `mid-dialog` close button now has a translated `aria-label` in all supported languages (nb, nn, se, en)
- `mid-textfield` now validates `email` and `url` input types using a `typeMismatchValidator`, surfacing native browser type-mismatch errors through the component's validation API
