---
'@felleslosninger/minid-elements': patch
---

`mid-code-input`: programmatic value changes no longer wipe the page's error message, and `focus()` before first render is queued instead of dropped. `mid-textfield`: the clear button and the password-reveal eye move inside the field.

### `mid-code-input`: programmatic `value`/`type` changes sync the form silently

0.1.6 made the `value`/`type` watcher call `setValue`, which runs validators, resets the `forceError()` flag and dispatches `mid-invalid-show`/`mid-invalid-hide` — from inside Lit's update cycle, and a second time per keystroke on top of the `input` handler's own `setValue`. A stray `mid-invalid-hide` reaching the page's `@mid-invalid-hide` handler cleared the server-side error the page had just rendered, and the `forceError()` reset defeated the page's attempt to pin it. This is the same class of race the watcher `setValue` removal fixed back in `29e8693` (WebOTP auto-submit).

The watcher now tells programmatic changes apart from ones the `input` handler already committed, and syncs those through a new `FormControlMixin.syncFormValue()`: the form value is updated, validators re-run and `valueChangedCallback` still fires, but error-display state is untouched — no `forceError` reset, no `mid-invalid-*` dispatch, and the control is not marked touched (a programmatic set is not user interaction; before 0.1.6 programmatic sets never reached the mixin at all, so this restores that baseline with the form value actually kept in sync). The `--show-error`/`--invalid` custom states are likewise not re-evaluated until the next interaction. User input still flows through `setValue` exactly as before, so typing still clears a shown error and WebOTP ordering is unchanged. `new FormData(form)` keeps reflecting programmatic sets like `inputField.value = ''`.

Known and unchanged: validator-bound attribute changes (`required`, `minlength`, `maxlength`, `pattern`) still route through the full `setValue` via `attributeChangedCallback`, as they have since before 0.1.6.

### `mid-code-input`: `focus()` before first render is queued, not dropped

`focus()` delegated to the internal input with an optional chain, so a call made before the component's first render — typical for a page that awaits its own `updateComplete`, which does not await the child's — was silently dropped, and keystrokes sent right after went nowhere. The call is now queued on the component's `updateComplete` and lands once the input exists, provided the element is still connected when it resolves.

### `mid-textfield`: the clear button and the password-reveal eye move inside the field

Both in-field buttons used to render as Designsystemet `ds-field-affix`es —
tinted boxes attached to the right of the input, sharing the field's outer
border but sitting outside the input's own. Because `.ds-input:focus-visible`
and `.ds-input[aria-invalid=true]` style the input only, a focused field drew
its ring around just part of itself and an invalid field went red on the left
while the button's box stayed grey. The affix also shortened the bordered
input box by 70px against an otherwise identical field (318px vs 388px at
`size="lg"`), so clearable and password fields read as narrower than their
neighbours.

The buttons are now overlaid on padding the input reserves for them, so the
input is the whole visual field again and Designsystemet's own focus, hover,
invalid, readonly and forced-colors styling covers them for free. The input
box now matches a plain field exactly, and the usable text area grows. The
gutter is reserved by capability, not visibility: the clear button only
appears once the field has a value, and the text must not shift when it does.
With `clearable` and `passwordtoggle` together, the two buttons share one
rail — trash before eye — with a slice reserved for each.

Alongside that:

- the icons are sized from `--ds-size-7` instead of a frozen `1.75rem`, so
  they finally track `data-size` (24/28/32px for sm/md/lg) — `size="lg"`
  fields previously kept 28px icons
- each hit area fills the field's inner height (WCAG 2.5.8), while the focus
  ring sits on an inner box so it stays inside the field at every size
- neither button moves focus off the input when clicked, so clearing or
  revealing a half-typed value no longer runs blur-validation (previously a
  Safari-only error flash, since WebKit blurs to `<body>` on button mousedown)
- `aria-controls` points the eye at the input; Edge's duplicate native
  reveal/clear controls are suppressed, and WebKit's saved-credential key icon
  is shifted clear of the buttons so autofill stays clickable
- `part="clear-button"` and `part="password-toggle-button"` now both target
  the `<button>` element itself (as their docs always said), not a wrapper
  span, in every rendering mode

The accessible names still carry the state (`Vis passord` ⇄ `Skjul passord`,
`Tøm` on the clear button). A `prefix`/`suffix` slot keeps the affix
rendering for both buttons, since the overlay needs the field to itself — the
fallback shares the exact same button templates, so parts, names, icon scaling
and the mousedown guard are identical there. Hovering an invalid overlay field
keeps Designsystemet's red outline.
