import type { IconLibrary } from './icon-library.js';
import { MidIconName } from '../../types/icon-name';

const library: IconLibrary<MidIconName> = {
  name: 'nav-aksel',
  resolver: (name) => `../../../src/assets/icons/${name}.svg`,
};

export default library;
