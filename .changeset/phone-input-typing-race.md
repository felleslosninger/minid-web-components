---
'@felleslosninger/minid-elements': patch
---

`mid-phone-input`: text typed over a selection right after the field appears is no longer lost.

The field filled in its country code ("+47 ") from a `setTimeout` in `connectedCallback`. On a busy page that timer could fire after typing had started: it cleared the selection being replaced, the field ended up as "+47 +47 99999999", the formatter cut that to "+47", and the form submitted only the country code. The country code is now filled in right after the first render instead. The `TypeRightAfterConnect` story reproduces the case.
