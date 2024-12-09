import { IconLibrary } from 'src/components/icon/icon-library';

const library: IconLibrary = {
  name: 'country',
  resolver: (name) =>
    new URL(`../../assets/flags/${name}.svg`, import.meta.url).toString(),
};

export default library;
