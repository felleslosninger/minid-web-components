# @felleslosninger/minid-elements

This repository contains a collection of web components built with Lit. The web components are published at https://www.npmjs.com/package/@felleslosninger/minid-elements

## Installation

**Install the package:**

```bash
npm install @felleslosninger/minid-elements
```

or

```bash
yarn add @felleslosninger/minid-elements
```

## CSS Setup

minid-elements uses Tailwind CSS v4 and CSS cascade layers internally. To prevent style conflicts, you must declare the layer order **before** importing Tailwind in your global stylesheet:

```css
/* Establish layer order before @import 'tailwindcss', so ds.* layers sit
   between base and utilities rather than after utilities. */
@layer theme, base, ds.theme, ds.base, ds.components, components, utilities;
@import 'tailwindcss';
@import '@felleslosninger/minid-elements/styles';
@source '../../node_modules/@felleslosninger/minid-elements/dist';
```

The stylesheet link in your HTML must have the `data-mid-tailwind` attribute so the components can resolve scoped styles correctly:

```html
<link rel="stylesheet" href="./styles/tailwind.css" data-mid-tailwind />
```

### CSS entrypoints

| Import path | File | Description |
|---|---|---|
| `@felleslosninger/minid-elements/styles` | `dist/styles.css` | Component styles |
| `@felleslosninger/minid-elements/theme` | `dist/theme.css` | Design tokens / theme |
| `@felleslosninger/minid-elements/globals` | `dist/index.css` | Global base styles |

## Usage

Import the desired components into your project:

```ts
import '@felleslosninger/minid-elements/button';
```

```html
<mid-button variant="primary">Click me</mid-button>
```

### Translations

Built-in UI labels (e.g. "Clear", "Show password", "Open country selector") are available in Norwegian Bokmål, Nynorsk, Northern Sami, and English. Components pick up the page language automatically via the `lang` attribute.

To override or add translations for a language:

```ts
import { registerTranslations } from '@felleslosninger/minid-elements';

registerTranslations('en', {
  clear: 'Remove',
  showPassword: 'Reveal password',
  hidePassword: 'Conceal password',
  openCountrySelector: 'Choose country',
});
```

## CDN Usage

Alternatively, you can use MinId Elements directly from our CDN. Here's an example of how to include the components in your HTML file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MinID CDN Example</title>
    <link
      rel="stylesheet"
      href="https://cdn.minid.no/minid-elements/latest/index.css"
      data-mid-tailwind
      crossorigin="anonymous"
    />
    <script
      type="module"
      src="https://cdn.minid.no/minid-elements/latest/index.js"
    ></script>
  </head>
  <body>
    <mid-button>Click me</mid-button>
  </body>
</html>
```

This example demonstrates how to include the mid-button component. You can replace this with any other component from the MinId Elements library.

## Documentation

View the complete component documentation and examples in our Storybook:

[https://elements.minid.no/](https://elements.minid.no/)

## Development

If you're contributing to this project, follow these steps:

1. Clone the repository.
2. Install dependencies: `pnpm install`.
3. Build the project: `pnpm run build`.
4. Run the development server: `pnpm run storybook:dev`.

## Publishing

This project uses [changesets](https://github.com/changesets/changesets) for versioning and publishing.

### Adding a changeset

When you make a change that should be released, add a changeset:

```bash
pnpm changeset
```

Follow the prompts to select the bump type (patch, minor, or major) and describe the change. This creates a markdown file in the `.changeset/` directory that should be committed with your PR.

### Releasing

When PRs with changesets are merged to `main`, the changesets action will automatically create a "Version Packages" PR that bumps versions and updates the changelog. Merging that PR triggers the actual publish to npm and deploys the new version to the CDN.

## Contributing

We welcome contributions! Please feel free to open issues and pull requests.

## License

MIT License - See [LICENSE](LICENSE) for more information.
