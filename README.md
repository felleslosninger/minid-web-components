# @felleslosninger/minid-elements

This repository contains a collection of web components built with Lit.

## Installation

**1. Set up your environment:**

Since this package is hosted in an internal GitHub repository, you'll need to configure your npm or yarn client to authenticate with a personal access token (PAT).

* **Create a PAT:**
    - Go to your GitHub settings.
    - Navigate to "Developer settings" -> "Personal access tokens" -> "Tokens (classic)".
    - Generate a new token with the `read:packages` scope.

* **Configure npm:**
    - Create or edit your `~/.npmrc` file:

      ```
      //npm.pkg.github.com/:_authToken=[YOUR_PERSONAL_ACCESS_TOKEN]
      @felleslosninger:registry=https://npm.pkg.github.com/
      ```

* **Configure yarn:**
    - Create or edit your `~/.yarnrc.yaml` file:

      ```yaml
      npmScopes: {
        felleslosninger: {
          npmRegistryServer: "https://npm.pkg.github.com"
          npmAlwaysAuth: true
          npmAuthToken: "[YOUR_PERSONAL_ACCESS_TOKEN]"
        }
      }
      ```

**2. Install the package:**

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

## Documentation
View the complete component documentation and examples in our Storybook:

[https://verbose-telegram-zwgl6jl.pages.github.io/](https://verbose-telegram-zwgl6jl.pages.github.io/)

## Development
If you're contributing to this project, follow these steps:

1. Clone the repository.
2. Install dependencies: `npm install` or `yarn install`.
3. Run the development server: `npm run dev` or `yarn dev`.
4. Build the project: `npm run build` or `yarn build`.

## Contributing
We welcome contributions! Please feel free to open issues and pull requests.

## License
BSD 3-Clause License - See [LICENSE](LICENSE) for more information.
```
