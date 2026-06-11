# Changelog

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
