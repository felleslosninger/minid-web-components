import type { IconLibrary } from './icon-library.js';

const library: IconLibrary = {
  name: 'nav-aksel',
  resolver: (name) => `../../../src/assets/icons/${name}.svg`,
};

export default library;
