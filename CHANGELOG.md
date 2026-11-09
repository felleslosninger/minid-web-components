# Changelog

## 0.2.0

### Minor Changes

- 2834b28: `mid-phone-input` rebuilt: the country code is its own control to the left (Designsystemet `ds-suggestion`, no flags, built-in list, names in nb/nn/en/se), with Designsystemet bumped to 1.23. Plus three WCAG fixes: `mid-menu-item` is the only focusable element, `mid-helptext` exposes `aria-expanded`/`aria-controls` and localises its label, and `mid-alert` localises its close button.

  ### `mid-phone-input`: country code as a separate control

  The flag button and the dial code inside the number field are gone. The field is now a `fieldset` whose legend is the `label`, a country-code combobox to the left (`part="country-input"`) and the national number to the right (`part="phone-number"`). Both controls carry screen-reader-only labels from the component translations ("Landskode" / "Telefonnummer"), and the combobox is described by the selected country name, so the accessibility tree exposes the group "Mobilnummer", the combobox "Landskode" (value "+47", description "Norge") and the textbox "Telefonnummer". `required` is now set on the number input too, so it is announced as required. `description` and the validation message stay on the number input, and the number input is also described by the selected country code ("Landskode +47 (Norge) er valgt i feltet foran."), ahead of the description, so a user whose focus is sent straight to the number field on page load still hears about the control in front of it. When a full international number typed into the number field moves the country, a polite status announces it ("Landskode endret til +46 (Sverige)."); the message is cleared as soon as the country changes again, so it never describes a stale state.

  The two inputs are drawn as one field (shared radius, a single seam, and the whole field turns red on error). Norway (+47) is selected by default. The country control shows only the dial code and the list reads "Norge (+47)"; focusing it selects the text so typing replaces it. Type a dial code (`46`, `+46`), an ISO code (`DK`) or a name (`Sve`) to filter the list; exact ISO/dial-code matches come first, then names that start with the text, then names that contain it. Enter or a click selects. Free text resolves on blur when it is unambiguous and otherwise snaps back; Escape closes the list and brings the selected code back. A number typed without its trunk prefix is shown in the national format once the field changes (`70 123 45 67` under +46 becomes `070-123 45 67`). A full international number typed, pasted or autofilled into the number field (`+46 70 123 45 67`, `0046…`) switches the country and keeps the national part, so flows that fill `+47 99999999` keep working. A code no country in the list uses (`+800`, `+882`) gives no value rather than a number under the selected country's code. Enter in the country control picks a country and does not reach the host, so page-level Enter-to-submit handlers only fire from the number field.

  ```html
  <mid-phone-input
    name="mobile"
    label="Mobilnummer"
    description="Vi sender en engangskode til dette nummeret"
  ></mid-phone-input>
  ```

  The list is built from `getCountries()` with names that follow the active `lang`: `countryLabelsNo` (bokmål, also the fallback), `countryLabelsNn` and `countryLabelsSe` (new, generated from CLDR by `pnpm make-country-labels`; the Sami names need native review) and `countryLabelsEn`. All four are exported from `./countries`. Four typos in the bokmål table are fixed (Burkina Faso, Den sentralafrikanske republikk, Elfenbenskysten, Mikronesiaføderasjonen). So the `mid-combobox` + `mid-menu searchable` wrapper that pages used to render themselves is no longer needed:

  ```html
  <!-- before -->
  <mid-combobox>
    <mid-phone-input
      slot="trigger"
      country="NO"
      label="Mobilnummer"
    ></mid-phone-input>
    <mid-menu searchable>…245 mid-menu-items with flags…</mid-menu>
  </mid-combobox>

  <!-- after -->
  <mid-phone-input label="Mobilnummer"></mid-phone-input>
  ```

  Breaking details:
  - `mid-country-click` is gone, and `mid-combobox` no longer special-cases a `mid-phone-input` trigger.
  - `mid-combobox` now closes and returns focus to the trigger when an item is selected (unless `stayopenonselect`), as documented; it used to stay open for every trigger except a phone input.
  - The `country-button` part is replaced by `country-input`; `country-list` is new. `label` is now the legend.
  - `value` is `''` instead of `"+47"` while no number has been entered, so `required` actually fails on an empty field. `nationalnumber` holds digits only.
  - `mid-input` / `mid-change` also fire when the user changes the country; `mid-focus` / `mid-blur` come from the number input only.
  - `size` (`sm` | `md` | `lg`) is new.
  - `country` accepts lower case (`"se"`), and an unknown code keeps the current country. Both used to throw `Unknown country` and leave the component empty.
  - `value` and `country` set right after the element is attached (before its first render) are applied; they used to be dropped.
  - A form reset restores the `value` and `country` the field had at its first render, also after the element has been moved in the DOM.
  - Enter in the number field outside a `<form>` no longer throws.
  - With `readonly` the country control is a plain read-only input (no combobox); Designsystemet then marks the legend with the read-only icon.
  - axe reports a minor `aria-allowed-role` on the open combobox: u-datalist sets `role="combobox"` explicitly on an `input[list]`, which already has that role implicitly. Upstream behaviour, harmless.
  - The shadow root now has two `<input>`s; tests that located the field with `locator('input')` should use `input[type="tel"]`.
  - Translations: `openCountrySelector` is removed; `countryCode`, `phoneNumber`, `countrySuggestionsSingular`, `countrySuggestionsPlural`, `countryCodeSelected` and `countryCodeChanged` are added (the last two take `{code}` and `{country}` placeholders). Apps that register their own language with `setTranslations()` should add them. The Northern Sami values need native review.

  ### Designsystemet 1.23

  `@digdir/designsystemet-web`, `@digdir/designsystemet-css` and the `@digdir/designsystemet` CLI move from 1.13 to 1.23 (u-elements 2.x). The 1.x suggestion swallowed focus events inside shadow roots, never positioned its list there and reported `aria-expanded="true"` permanently; 2.x fixes all three. Visible side effect: `.ds-label` (field labels and this legend) is now semibold instead of medium, matching Designsystemet's own update. The token config is migrated to the flat `colors` schema the 1.23 CLI requires.

  The `/flags/*.svg` assets and `mid-icon library="country"` are still shipped, but nothing in the library uses them any more.

  Three findings from the WCAG review of minid-onthefly-school (2026-09-24) that live in this library.

  ### `mid-menu-item`: one focusable control per item

  The item wrapped its slot in a `mid-button`, so every `role="menuitem"` host contained a second focusable control — a `button`, or an `a` for `href` items. Assistive tech read "Logg ut, button" instead of a menu item, and `mid-menu`'s arrow-key navigation focused the inner button rather than the item (WCAG 4.1.2).

  The host now carries `role="menuitem"`, the roving `tabindex` (defaults to `-1`; `mid-menu` sets `0`/`-1` as the current item changes) and focus itself; the rendered box is a non-interactive `part="base"` styled like a tertiary `mid-button`. The focus ring is drawn on the base from the host's `:focus-visible`, with the same `--ds-color-focus-*` tokens as the `focus-ring` utility. Activation is unchanged: `mid-menu` turns Enter/Space into `click()` on the current item, so `@click` handlers keep working, and `href` items navigate from that click (`window.location.assign`, skipped when a click listener calls `preventDefault()`) instead of from an inner anchor — modifier-click to open in a new tab is no longer supported on menu items. The `focus()` override and the `button` query are gone; `active` and `variant` are unchanged.

  ### `mid-helptext`: toggle state exposed

  The `?` button now sets `aria-expanded` to match `open` and `aria-controls="helptext-body"`, so screen readers announce collapsed/expanded. `aria-describedby` still exposes the text either way. Its label ("Hjelpetekst") was Norwegian in every language; it now reads `helpText` from the component translations ("Help text" in English) and follows `lang` changes. `helpText` is a new key on `ComponentTranslations` (the Northern Sami value "Veahkketeaksta" needs native review).

  ### `mid-alert`: close button label follows the language

  The closable alert's button was `aria-label="Dismiss alert"` in every language. It now reads `dismissAlert` from the component translations ("Lukk varsel" for nb/nn, "Dismiss alert" for en) and re-renders on `lang` changes through `LangController`, like `mid-dialog`. `dismissAlert` is a new key on `ComponentTranslations`; apps that register their own language with `setTranslations()` should add it. The Northern Sami value ("Gidde dieđáhusa") needs native review.

## 0.1.8

### Patch Changes

- 20ea947: `mid-textfield`: `hidedescription`. `mid-phone-input`: `description` attribute and slot, `hidedescription`, a `hidelabel` fix and a reliably announced validation message.

  ### `mid-textfield`: `hidedescription`

  `hidelabel` hides both the label and the description, so a visible label with a screen-reader-only description meant clipping `::part(description)` from the page. `hidedescription` does that in the component, as on `mid-code-input`: the description is hidden visually but keeps its `id` and stays in `aria-describedby`. `hidelabel` is unchanged. The `description` part is now documented.

  ```html
  <mid-textfield
    label="Nytt passord"
    description="Minst 8 tegn, og både bokstaver og tall"
    hidedescription
  ></mid-textfield>
  ```

  ### `mid-phone-input`: `description`, `description` slot and `hidedescription`

  Rendered between the label and the input as `part="description"` and wired to the input through `aria-describedby`, ahead of the validation message. `hidedescription` hides it visually and is independent of `hidelabel`.

  ```html
  <mid-phone-input
    label="Mobilnummer"
    description="Vi sender en engangskode til dette nummeret"
  ></mid-phone-input>
  ```

  ### `mid-phone-input`: `hidelabel` no longer hides the whole field

  An unclosed `<label>` wrapped the entire component, so `hidelabel` clipped the country button and the input along with the label, and every phone input carried 8px of extra bottom margin. Both are gone.

  ### `mid-phone-input`: validation message

  Always in the DOM with only its text toggling, as on the other fields since 0.1.6, so WebKit announces it reliably. Exposed as `part="validation-message"`.

  ### Docs

  `mid-code-input`'s `hidedescription` is documented, and `mid-phone-input`'s slots, parts and events match the markup (`phone-number`, not `input`).

## 0.1.7

### Patch Changes

- ea0b287: `mid-code-input`: programmatic value changes no longer wipe the page's error message, and `focus()` before first render is queued instead of dropped. `mid-textfield`: the clear button and the password-reveal eye move inside the field.

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

## 0.1.6

### Patch Changes

- fbe24ac: Validation messages that actually announce, and the missing pieces of `mid-checkbox` and `mid-code-input`

  A pass over the three form controls that show an error message. The common thread is that a message which appears after a failed submit was not reaching screen reader users, and that two of the three components were missing the parts a page needs to present one at all.

  ### Validation messages are announced reliably in Safari/VoiceOver

  `mid-textfield` and `mid-code-input` toggled the message with the `hidden` attribute, so the `aria-live` region went from `display: none` to visible at the same moment its text arrived. WebKit does not reliably announce a live region in that state, which left a rejected value silent for VoiceOver users whenever the field already held focus and no focus event could carry the error instead — the usual case, since the message appears on a submit attempt.

  The region now stays in the DOM at all times and only its contents are toggled, so the message is announced as text arriving in a region the screen reader is already watching. When there is no message the element renders nothing, collapses to zero height and drops its spacing (and, in `mid-textfield`, the `ds-validation-message` class, so its error icon is not painted), leaving the layout unchanged in both states. `mid-checkbox`'s new message uses the same pattern.

  All three components also gain a `validation-message` CSS part, so the message can be styled from the outside the same way everywhere.

  ### `mid-checkbox` can present its own validation message

  `mid-checkbox` ran its validators and emitted `mid-invalid-show`, but rendered nothing and set no error state, so every page had to build its own message and live region — and none of them could associate that message with the checkbox, because an `aria-describedby` IDREF cannot cross the shadow boundary.
  - New `invalidmessage` property renders a `ds-validation-message` below the label, wired to the input with `aria-describedby` and `aria-errormessage`, the same way `mid-textfield` does it. It remains available to anyone who navigates back to the field.
  - The input now gets `aria-invalid`, so an invalid checkbox picks up the designsystemet error styling instead of staying visually neutral next to a red message. The existing `invalid` property is no longer inert — it drives `aria-invalid` too.
  - The `description` slot is now associated with the input as well, not only the `description` attribute. The component owns the whole `aria-describedby` attribute to do this: `ds-field` builds that attribute from its `data-field` children itself, but only once, when it connects, so sharing the attribute meant the same id appeared twice and the description association was dropped the first time the validation message appeared.
  - New `validation-message` CSS part, and the existing `label` and `description` parts are now documented.

  ### `mid-code-input` can show a description
  - New `description` attribute and matching `description` slot (use the slot when the text needs HTML), rendered between the label and the character boxes.
  - The description is wired into the input's `aria-describedby`, so screen readers announce it when the field receives focus.
  - New `hidedescription` attribute hides it visually while keeping it announced. `hidelabel` and `hidedescription` are independent, so a visible label can be paired with a screen-reader-only description.
  - New `description` CSS part for styling from the outside.

  ### `mid-code-input` with `type="number"` accepts only the digits 0-9

  The underlying field is now always `type="text"`, with digit filtering done by the component. A native `type="number"` input let several things through that a one-time-code field should not accept:
  - `e`, `E`, `+`, `-` and `.` are valid in a number input, so values such as `1e5` or `1.2` could be entered
  - Arrow keys stepped the value up and down
  - `setSelectionRange` is not supported on number inputs, so focusing or clicking a partly filled field threw `InvalidStateError` and left the caret in the wrong place
  - `maxlength` and `pattern` are ignored on number inputs

  Filtering now also covers paste, drag-and-drop and autofill, not just keystrokes, and a `value` set programmatically is normalised the same way. Pasting a spaced code such as `123 456` into a six character field no longer loses the last digit, because the native paste applied `maxlength` to the raw text before the non-digits were stripped. `type="text"` is unchanged and still accepts any character.

  ### `mid-code-input`'s highlighted box follows the caret

  The highlight was derived from the length of the value, so it always sat at the end of what had been typed. The caret in the underlying field moves with the arrow keys and Home/End, so as soon as it was moved the visible highlight pointed at the wrong box and the next keystroke landed somewhere the user had not been shown.

  The highlight is now driven by the caret's real position, so moving the caret moves the ring and the blinking bar with it. When the caret sits in a box that already holds a character the bar is drawn at the leading edge of that box rather than on top of the character. Typing, pasting and clicking a box are unaffected - the caret ends up where it always did, so the highlight lands where it always did.

  Arrow keys were left working rather than blocked: inside a text field they are how a screen reader user reviews what they typed character by character, and this became reachable for `type="number"` only now that the field is no longer a native number input that stepped the value instead.

  ### `mid-code-input` gets a `labelsize`

  The label sets a weight but no size, so it inherited the surrounding font-size. Next to a `mid-textfield size="lg"`, whose label is sized by `data-size` on its `ds-field`, the code input's label came out visibly smaller in the same form.

  `labelsize` sizes the label from the designsystemet body scale, so `labelsize="lg"` gives the same 21px/500 label a `mid-textfield size="lg"` has. Left unset the label inherits as before, so nothing changes for existing consumers. `data-size` on the host is not the mechanism here: it also scales the description and the validation message, and it scales the digits inside the character boxes without widening the boxes.

  ### `mid-textfield` forwards `required`

  `mid-textfield` did not pass `required` to its internal `<input>`, so a required field was never announced as required — only the validators on the host knew. The attribute is now forwarded, matching `mid-checkbox`. Validation behaviour is unchanged: the internal input is not form-associated, so the host's validators are still what run, and no native validation bubble appears.

## 0.1.5

### Patch Changes

- 13082cb: Give `mid-spinner` an accessible name, and use it in `mid-button`'s loading state

  ### New features and fixes
  - `mid-spinner` has a new optional `label` property that renders visually hidden text describing what is loading. The animated SVG is now `aria-hidden="true"` so it is no longer announced as an unlabelled graphic. Previously `mid-spinner` had no accessible name or role at all, so a loading state shown only by a spinner was conveyed to sighted users alone.
  - `mid-button` now passes a translated loading string to its spinner when `loading` is set without `loadingtext`. With `loadingtext` the visible text still provides the name, so the spinner stays unlabelled and nothing is announced twice.
  - `ComponentTranslations` has a new `loading` key (nb, nn, se, en), overridable through `setTranslations`.

  `label` is an accessible _name_, not a status message — consumers whose loading state changes over time (waiting → done → failed) still need their own `role="status"`/`aria-live` region, since a name change does not announce.

## 0.1.4

### Patch Changes

- 8a68530: Replace inline styles in `mid-alert` with Tailwind utility classes to fix CSP violations. Add `id`/`for` pairing to `mid-checkbox` input and label for correct accessibility.

## 0.1.3

### Patch Changes

- d1e95d6: Add `mid-language-selector` component for locale switching, using Designsystemet dropdown styling

## 0.1.2

### Patch Changes

- 2a9c51b: Add color variants to `mid-validation-message`; accessibility improvements in `mid-textfield`

  ### New features and fixes
  - `mid-validation-message` has a new `color` property (`danger` | `success` | `warning` | `info`) that controls icon, text color, and `aria-live` behavior. Defaults to `danger` for backwards compatibility
  - `mid-textfield` description element now uses `aria-hidden="true"` instead of a `data-field` attribute; removed stray `data-field` from validation paragraph

## 0.1.1

### Patch Changes

- 13f6f5c: Add alertdialog support to `mid-dialog`; add type mismatch validation to `mid-textfield`

  ### Fixes and improvements
  - `mid-dialog` has a new `alertdialog` boolean attribute that switches the dialog role to `alertdialog` and focuses it on open, for blocking dialogs requiring immediate user attention
  - `mid-dialog` close button now has a translated `aria-label` in all supported languages (nb, nn, se, en)
  - `mid-textfield` now validates `email` and `url` input types using a `typeMismatchValidator`, surfacing native browser type-mismatch errors through the component's validation API

## 0.1.0

### Minor Changes

- 0af8e9b: Add i18n language support across components; new alert aria-live control; bundle styles.css and theme.css as separate CSS package entrypoints

  ### New features
  - `mid-textfield`, `mid-search`, and `mid-phone-input` now automatically pick up the page language (nb, nn, se, en) for built-in labels such as "Clear", "Show password", "Hide password", and "Open country selector"
  - New `translations.ts` utility — override or extend built-in strings per language with `registerTranslations()`
  - `mid-alert` has a new `arialive` attribute (`"polite"`, `"assertive"`, `"off"`) to control when screen readers announce alert content
  - `mid-phone-input` has a new `autocomplete` attribute (`"tel"` / `"tel-national"`) to control how browser autofill applies the country prefix
  - `./styles` now maps to `dist/styles.css` and `./theme` to `dist/theme.css` as separate CSS package entrypoints. Applications importing these paths should verify they are getting the expected file.

  ### Bug fixes
  - `mid-textfield` clear and show/hide password buttons are now reachable by keyboard (tab order)
  - `mid-code-input` placeholder circle styling moved to shadow DOM CSS, fixing rendering when Tailwind base styles are not available

## 0.0.140

### Patch Changes

- 345f717: add @digdir/designsystemet-web

A changelog for logging changes.

## 0.0.139

Minor improvements:

- Screen readers:
  - Code Input "○" is now hidden for screen readers.
  - Text field and Code Input @mid-invalid-show will be read by the screen reader.
  - Phone Input now has internal invalidMessage that will display under the field. Also focus no longer highlight the text to compensate for screen readers.
  - Icons are no longer read as image by screen readers.
- Minor fixes
  - Code Field focus highlight will be kept on last square so the user don't lose focus.

## 0.0.138

- Bug fix, in the code input number field, numbers disappear when non number is written

## 0.0.137

- Form control's `#touched` is set true when altered instead of focused.

## 0.0.136

- Fix bugs with code input field where numbers disappear when a character is entered

## 0.0.135

- Events are now dispatched from the hidden input field in `<mid-code-input>`

## 0.0.134

- Fix bug with iOS zoom on `<mid-code-input>`
- Change auto-submit of WebOTP to trigger on 'mid-complete' event.
- Added inputmode control to `<mid-textfield>`

## 0.0.132

- Fix race condition at form submit through WebOTP

## 0.0.131

- Fix poor experience for mobile users of `mid-code-input`
- Fix WebOTP API for `mid-code-input`

## 0.0.129

- Added `mid-link` class styling
- Added `clear()` method to `<mid-code-input>`

## 0.0.128

- Fix `mid-label` class styling

## 0.0.127

- Updated icon set to `@navikt/aksel-icons v7.23.2`
- Fixed checkbox description
- Added native style classes `mid-button` and `mid-input`
- Improvements to the documentation
- Updated/fixed radio component
- Removed radio button component from sidebar

## 0.0.125

- Added 'crossorigin' attribute to style tag in cdn example code.

## 0.0.124

- Code input can now be focused with `focus()` function

## 0.0.123

- Minor documentation update

## 0.0.122

- Text is now selected on focusing a character in the code-input component

## 0.0.121

- CDN stylesheet fix.

## 0.0.120

- New mask feature for textfield component. Input value can be modified with a mask.

## 0.0.119

- Fix `mid-select` event not being fired properly in the `mid-menu` component

## 0.0.118

- Fix cdn build

## 0.0.117

- Fix a11y issues
- Interaction tests for alert component
- Fix cdn vite config

## 0.0.116

- Instead of tailwind styles `<link>` element requiring `id=tailwind-styles` it now requires `data-mid-tailwind` attribute instead `<link data-mid-tailwind href="/tailwind.css" rel="stylesheet" />`
- Implemented storybook testing addons

## 0.0.115

- Fixed a bug where value was not initialized in phone input

## 0.0.114

- Upgraded to Storybook 9
- Added tags to show development stage of components

## 0.0.113

- Fixed a bug where phone input would not update it's value when the country changed

## 0.0.112

- Fix build

## 0.0.111

- Updated design and functionality of the code input component

## 0.0.110

- Fix static storybook build

## 0.0.109

- English list of countries
- Country label exports moved to `@felleslosninger/minid-elements/countries`

## 0.0.108

- Step indicator improved a11y
- Phone input can now be toggled readonly

## 0.0.107

- Changed step indicator style

## 0.0.106

- New validation message component
- Added invalid styling for phone input
- Fixed bugs in phone input

## 0.0.105

- Fixed CDN build

## 0.0.104

- Fixed styling in static storybook build
- Updated static asset handling in the icon component (icons and flags.) Consuming application should copy assets to their public folder. This makes the icon component considerably smaller as it no longer keeps track of all the paths to all static assets.
  This command can be added to `package.json` for easy copying:

```bash
    cp -aR node_modules/@felleslosninger/minid-elements/dist/icons/ ./public/icons && cp -aR node_modules/@felleslosninger/minid-elements/dist/flags/ ./public/flags
```

## 0.0.103

- Updated how tailwind styles are inserted. It is now required to have link element in the head with `id="tailwind-styles"`
- The consuming application should now generate tailwind classes for the component library. This removes redundant css.
- A tailwind mixin is provided from the library `import { styled } from '@felleslosninger/minid-elements/tailwind-mixin';`
