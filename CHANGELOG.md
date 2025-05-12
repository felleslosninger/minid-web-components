# Changelog

A changelog for logging changes

## 0.0.104

- Fixed styling in static storybook build
- Updated static asset handling in the icon component (icons and flags.) Consuming application should copy assets to their public folder. This makes the icon component considerably smaller as it no longer keeps track of all the paths to all static assets.
  This command can be added to `package.json` for easy copying:

```bash
    "copy-assets": "cp -aR node_modules/@felleslosninger/minid-elements/dist/icons/ ./public/icons && cp -aR node_modules/@felleslosninger/minid-elements/dist/flags/ ./public/flags"
```

## 0.0.103

- Updated how tailwind styles are inserted. It is now required to have link element in the head with `id="tailwind-styles"`
- The consuming application should now generate tailwind classes for the component library. This removes redundant css.
- A tailwind mixin is provided from the library `import { styled } from '@felleslosninger/minid-elements/tailwind-mixin';`
