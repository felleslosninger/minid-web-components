---
'@felleslosninger/minid-elements': patch
---

`mid-textfield`: `hidedescription`. `mid-phone-input`: `description` attribute and slot, `hidedescription`, a `hidelabel` fix and a reliably announced validation message.

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
