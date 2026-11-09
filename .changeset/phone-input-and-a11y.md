---
'@felleslosninger/minid-elements': minor
---

`mid-phone-input` rebuilt: the country code is its own control to the left (Designsystemet `ds-suggestion`, no flags, built-in list, names in nb/nn/en/se), with Designsystemet bumped to 1.23. Plus three WCAG fixes: `mid-menu-item` is the only focusable element, `mid-helptext` exposes `aria-expanded`/`aria-controls` and localises its label, and `mid-alert` localises its close button.

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
