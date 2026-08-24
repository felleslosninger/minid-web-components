---
'@felleslosninger/minid-elements': patch
---

Validation messages that actually announce, and the missing pieces of `mid-checkbox` and `mid-code-input`

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
