import type { IconLibrary } from './icon-library.js';

//
// System icons are a separate library to ensure they're always available, regardless of how the default icon library is
// configured or if its icons resolve properly.
//
// All MinID components must use the system library instead of the default library. For visual consistency, system
// icons are a subset of Nav Aksel Icons.
//
const icons = {
  'circle-broken': `
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.75C7.44365 3.75 3.75 7.44365 3.75 12C3.75 15.5909 6.04464 18.6478 9.24993 19.7808C10.1091 20.0844 11.0344 20.25 12 20.25C12.4142 20.25 12.75 20.5858 12.75 21C12.75 21.4142 12.4142 21.75 12 21.75C10.8618 21.75 9.76756 21.5546 8.75007 21.195C4.9642 19.8569 2.25 16.2464 2.25 12C2.25 6.61522 6.61522 2.25 12 2.25C16.2464 2.25 19.8569 4.9642 21.195 8.75007C21.5546 9.76756 21.75 10.8618 21.75 12C21.75 12.4142 21.4142 12.75 21 12.75C20.5858 12.75 20.25 12.4142 20.25 12C20.25 11.0344 20.0844 10.1091 19.7808 9.24993C18.6478 6.04464 15.5909 3.75 12 3.75Z" fill="currentColor"/>
    </svg>
    `,
};

const systemLibrary: IconLibrary<keyof typeof icons> = {
  name: 'system',
  resolver: (name) => {
    if (name in icons) {
      return `data:image/svg+xml,${encodeURIComponent(icons[name])}`;
    }
    return '';
  },
};

export default systemLibrary;
