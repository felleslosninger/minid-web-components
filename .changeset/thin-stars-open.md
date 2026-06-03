---
'@felleslosninger/minid-elements': minor
---

Add i18n language support across components; new alert aria-live control; bundle styles.css and theme.css as separate CSS package entrypoints

### New features

- `mid-textfield`, `mid-search`, and `mid-phone-input` now automatically pick up the page language (nb, nn, se, en) for built-in labels such as "Clear", "Show password", "Hide password", and "Open country selector"
- New `translations.ts` utility — override or extend built-in strings per language with `registerTranslations()`
- `mid-alert` has a new `arialive` attribute (`"polite"`, `"assertive"`, `"off"`) to control when screen readers announce alert content
- `mid-phone-input` has a new `autocomplete` attribute (`"tel"` / `"tel-national"`) to control how browser autofill applies the country prefix
- `./styles` now maps to `dist/styles.css` and `./theme` to `dist/theme.css` as separate CSS package entrypoints. Applications importing these paths should verify they are getting the expected file.

### Bug fixes

- `mid-textfield` clear and show/hide password buttons are now reachable by keyboard (tab order)
- `mid-code-input` placeholder circle styling moved to shadow DOM CSS, fixing rendering when Tailwind base styles are not available
