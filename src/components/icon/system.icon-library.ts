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
  'questionmark-circle-fill': `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" aria-hidden="true" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 16a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0-11c2.205 0 4 1.657 4 3.693 0 .986-.416 1.914-1.172 2.612l-.593.54-.294.28c-.477.466-.869.94-.936 1.417l-.01.144v.814h-1.991v-.814c0-1.254.84-2.214 1.675-3.002l.74-.68c.38-.35.59-.816.59-1.31 0-1.024-.901-1.856-2.01-1.856-1.054 0-1.922.755-2.002 1.71l-.006.145H8C8 6.657 9.794 5 12 5Z" clip-rule="evenodd"/>
    </svg>
  `,
  'questionmark-circle': `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" aria-hidden="true" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0Zm0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm0 14a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm0-11c2.205 0 4 1.657 4 3.693 0 .986-.416 1.914-1.172 2.612l-.593.54-.294.28c-.477.466-.869.94-.936 1.417l-.01.144v.814h-1.991v-.814c0-1.254.84-2.214 1.675-3.002l.74-.68c.38-.35.59-.816.59-1.31 0-1.024-.901-1.856-2.01-1.856-1.054 0-1.922.755-2.002 1.71l-.006.145H8C8 6.657 9.794 5 12 5Z" clip-rule="evenodd"/>
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
