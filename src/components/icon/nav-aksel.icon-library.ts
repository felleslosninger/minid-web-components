import type { IconLibrary } from './icon-library.js';
import { MidIconName } from '../../types/icon-name';

const library: IconLibrary<MidIconName> = {
  name: 'nav-aksel',
  resolver: (name) =>
    new URL(`../../assets/icons/${name}.svg`, import.meta.url).toString(),
};

export default library;
