## Getting started

- Run `yarn dev`
- Application available at `localhost:5173`
- For login to work, you need to set cookies through the dev-cookie-controller, example: `http://localhost:8080/cookie?uuid=a0e6ca73-f955-4b14-ae93-08610e049195&serviceProviderName=ID-porten%20test&locale=en`

# Developer

- `yarn dev`
- `yarn build`
- `yarn deploy`

Enable dev mode by adding `?mode=dev` to the url e.g 'http://localhost:5173/?mode=dev

## Locale

Change locale by adding `?locale=en` to the url e.g 'http://localhost:5173/?locale=en'

### lit-localize

Wrap a string or template in the msg function (details).
Create a lit-localize.json config file (details).
Run lit-localize extract to generate an XLIFF file (details).
Edit the generated XLIFF file to add a <target> translation tag (details).
Run lit-localize build to output a localized version of your strings and templates (details).

- `npx lit-localize extract`
- `npx lit-localize build`

## Tests

Tests are written using [vitest](https://vitest.dev)

- `yarn test:run` # run tests
- `yarn test:watch` # run tests in watch mode

# TODO

https://www.labnol.org/internet/reduce-google-fonts-size/21057/
vurder om det er greit at bruke google fonts direkte fra google
