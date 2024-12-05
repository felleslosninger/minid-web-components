import type { Preview } from '@storybook/web-components';
import { setCustomElementsManifest } from '@storybook/web-components';
import customElements from '../custom-elements.json';
import '../src/styles/tailwind.css'; // replace with the name of your tailwind css file
import '../src/styles/global.css';
import '../src/styles/vendor.css';

setCustomElementsManifest(customElements);

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', '*'],
      },
    },
    controls: {
      exclude: /(_.*|#.*|internals|validationMessage|validity|[a-z][A-Z]+)/, // exclude private props
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        format: true,
        excludeDecorators: true,
        transform: (source) => source.replace(/=\"\"/g, ''), // Remove ="" on boolean attributes
      },
    },
  },
  tags: ['autodocs', '!dev'],
};

export default preview;
