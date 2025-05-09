# Changelog

A changelog for logging changes

## 0.0.103

- Updated how tailwind styles are inserted. It is now required to have link element in the head with `id="tailwind-styles"`
- The consuming application should now generate tailwind classes for the component library. This removes redundant css.
- A tailwind mixin is provided from the library `import { styled } from '@felleslosninger/minid-elements/tailwind-mixin';`
