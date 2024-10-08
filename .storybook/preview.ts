import type { Preview } from '@storybook/web-components';
import '../src/tailwind.css'; // replace with the name of your tailwind css file
import '../src/vendor.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
