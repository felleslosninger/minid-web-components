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

## Usage
Import the desired components into your project:

```javascript
import '@felleslosninger/minid-elements/button';
<mid-button variant="primary">Click me</mid-button>
```

## CDN Usage
Alternatively, you can use MinId Elements directly from our CDN. Here's an example of how to include the components in your HTML file:

```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MinID CDN Example</title>
      <link rel="stylesheet" href="https://cdn.minid.no/minid-elements/latest/index.css" data-mid-tailwind crossorigin="anonymous"/>
      <script type="module" src="https://cdn.minid.no/minid-elements/latest/index.js"></script>
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
2. Install dependencies: `npm install` or `yarn install`.
3. Run the development server: `npm run dev` or `yarn dev`.
4. Build the project: `npm run build` or `yarn build`.

## Contributing
We welcome contributions! Please feel free to open issues and pull requests.

## License
MIT License - See [LICENSE](LICENSE) for more information.
```
