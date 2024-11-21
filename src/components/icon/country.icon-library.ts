import { IconLibrary } from 'src/components/icon/icon-library';
import { hasFlag } from 'country-flag-icons';

const library: IconLibrary = {
  name: 'country',
  resolver: (name) => {
    if (hasFlag(name)) {
      return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${name}.svg`;
    } else {
      return '';
    }
  },
};

export default library;
