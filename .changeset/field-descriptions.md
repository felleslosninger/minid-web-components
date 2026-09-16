---
'@felleslosninger/minid-elements': minor
---

`mid-textfield`: new `hidedescription` attribute. `mid-phone-input`: new `description` attribute and slot, `hidedescription`, a `hidelabel` fix, and a validation message that is announced reliably.

### `mid-textfield`: `hidedescription`

`hidelabel` hid both the label and the description, so a page that wanted a visible label with a screen-reader-only description had no attribute to reach for and clipped `::part(description)` itself. `mid-code-input` has had `hidedescription` since 0.1.6; this brings `mid-textfield` in line, using the same `sr-only` treatment.

```html
<mid-textfield
  label="Nytt passord"
  description="Minst 8 tegn, og både bokstaver og tall"
  hidedescription
></mid-textfield>
```

The description keeps its `id` and stays wired to the input through `aria-describedby`, so it is still announced — this hides it visually only. `hidelabel` is unchanged and continues to hide both; setting either one hides the description. The `description` CSS part, which pages were already styling, is now documented.

### `mid-phone-input`: `description`, a `description` slot and `hidedescription`

`mid-phone-input` had no description at all, so pages tucked an `sr-only` span into the label slot, turning the hint into part of the field's accessible _name_. It now takes a `description` attribute (or a `description` slot when the text needs HTML), rendered between the label and the input as `part="description"` and wired to the input through `aria-describedby` ahead of the validation message. `hidedescription` hides it visually while keeping it announced, and is independent of `hidelabel`, as on `mid-code-input`.

```html
<mid-phone-input
  label="Mobilnummer"
  description="Vi sender en engangskode til dette nummeret"
  hidedescription
></mid-phone-input>
```

### `mid-phone-input`: `hidelabel` no longer clips the whole field

The template opened a second, empty `<label>` before the field and never closed it, so the parser wrapped the entire component in it. With `hidelabel` that outer label got `sr-only`, clipping the country button and the input along with the label, and its `mb-2` added 8px of stray margin under every phone input. The outer label is gone: `hidelabel` now hides only the label, and the component is 8px shorter at the bottom.

### `mid-phone-input`: the validation message stays in the DOM and gets a part

Same change as 0.1.6 made for `mid-textfield`, `mid-code-input` and `mid-checkbox`: the `aria-live="polite"` region is always rendered and only its text toggles, instead of being revealed with `hidden` at the moment the message arrives, which WebKit does not reliably announce. It is exposed as `part="validation-message"` like on the other fields.

### Docs

`mid-code-input`'s `hidedescription` now has a description in the manifest, and `mid-phone-input`'s documented slots, parts and events match the markup (`phone-number` rather than `input`; `mid-invalid-show`/`mid-invalid-hide` listed).
