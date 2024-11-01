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
  'magnifying-glass': `
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 3.25C6.49594 3.25 3.25 6.49594 3.25 10.5C3.25 14.5041 6.49594 17.75 10.5 17.75C12.2319 17.75 13.8219 17.1427 15.0689 16.1295L20.4801 21.5407C20.773 21.8336 21.2478 21.8336 21.5407 21.5407C21.8336 21.2478 21.8336 20.773 21.5407 20.4801L16.1295 15.0689C17.1427 13.8219 17.75 12.2319 17.75 10.5C17.75 6.49594 14.5041 3.25 10.5 3.25ZM4.75 10.5C4.75 7.32436 7.32436 4.75 10.5 4.75C13.6756 4.75 16.25 7.32436 16.25 10.5C16.25 13.6756 13.6756 16.25 10.5 16.25C7.32436 16.25 4.75 13.6756 4.75 10.5Z" fill="currentColor"/>
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
  'xmark-octagon-fill': `
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.74175 2.46967C7.8824 2.32902 8.07317 2.25 8.27208 2.25L15.7279 2.25C15.9268 2.25 16.1176 2.32902 16.2583 2.46967L21.5303 7.74175C21.671 7.8824 21.75 8.07317 21.75 8.27208V15.7279C21.75 15.9268 21.671 16.1176 21.5303 16.2583L16.2583 21.5303C16.1176 21.671 15.9268 21.75 15.7279 21.75H8.27208C8.07316 21.75 7.8824 21.671 7.74175 21.5303L2.46967 16.2583C2.32902 16.1176 2.25 15.9268 2.25 15.7279L2.25 8.27208C2.25 8.07317 2.32902 7.8824 2.46967 7.74175L7.74175 2.46967ZM9.03033 7.96967C8.73744 7.67678 8.26256 7.67678 7.96967 7.96967C7.67678 8.26256 7.67678 8.73744 7.96967 9.03033L10.9393 12L7.96967 14.9697C7.67678 15.2626 7.67678 15.7374 7.96967 16.0303C8.26256 16.3232 8.73744 16.3232 9.03033 16.0303L12 13.0607L14.9697 16.0303C15.2626 16.3232 15.7374 16.3232 16.0303 16.0303C16.3232 15.7374 16.3232 15.2626 16.0303 14.9697L13.0607 12L16.0303 9.03033C16.3232 8.73744 16.3232 8.26256 16.0303 7.96967C15.7374 7.67678 15.2626 7.67678 14.9697 7.96967L12 10.9393L9.03033 7.96967Z" fill="currentColor"/>
    </svg>
  `,
  'exclamationmark-triangle-fill': `
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9999 2.25C12.273 2.25 12.5244 2.3984 12.6565 2.63743L22.1827 19.8874C22.311 20.1198 22.307 20.4026 22.1721 20.6312C22.0372 20.8597 21.7916 21 21.5262 21H2.47363C2.20823 21 1.96259 20.8597 1.82771 20.6312C1.69283 20.4026 1.68879 20.1198 1.8171 19.8874L11.3434 2.63743C11.4754 2.3984 11.7269 2.25 11.9999 2.25ZM12.001 8.75C12.4152 8.75 12.751 9.08579 12.751 9.5V13.5C12.751 13.9142 12.4152 14.25 12.001 14.25C11.5868 14.25 11.251 13.9142 11.251 13.5V9.5C11.251 9.08579 11.5868 8.75 12.001 8.75ZM11.001 16.5C11.001 15.9477 11.4487 15.5 12.001 15.5C12.5533 15.5 13.001 15.9477 13.001 16.5C13.001 17.0523 12.5533 17.5 12.001 17.5C11.4487 17.5 11.001 17.0523 11.001 16.5Z" fill="currentColor"/>
    </svg>
  `,
  'checkmark-circle-fill': `
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75ZM16.9536 9.27485C17.2434 8.93229 17.2007 8.41962 16.8582 8.12977C16.5156 7.83991 16.0029 7.88263 15.7131 8.22519L10.3251 14.5928L7.69952 11.9672C7.38222 11.6499 6.86778 11.6499 6.55048 11.9672C6.23317 12.2845 6.23317 12.7989 6.55048 13.1162L9.80048 16.3662C9.96114 16.5269 10.1817 16.6129 10.4088 16.6035C10.6358 16.594 10.8485 16.49 10.9953 16.3165L16.9536 9.27485Z" fill="currentColor"/>
    </svg>
  `,
  'information-square-fill': `
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.25 4C3.25 3.58579 3.58579 3.25 4 3.25H20C20.4142 3.25 20.75 3.58579 20.75 4V20C20.75 20.4142 20.4142 20.75 20 20.75H4C3.58579 20.75 3.25 20.4142 3.25 20V4ZM11 7.75C11 7.19772 11.4477 6.75 12 6.75C12.5523 6.75 13 7.19772 13 7.75C13 8.30228 12.5523 8.75 12 8.75C11.4477 8.75 11 8.30228 11 7.75ZM9.75 10.75C9.75 10.3358 10.0858 10 10.5 10H12C12.4142 10 12.75 10.3358 12.75 10.75V15.5H13.5C13.9142 15.5 14.25 15.8358 14.25 16.25C14.25 16.6642 13.9142 17 13.5 17H12H10.5C10.0858 17 9.75 16.6642 9.75 16.25C9.75 15.8358 10.0858 15.5 10.5 15.5H11.25V11.5H10.5C10.0858 11.5 9.75 11.1642 9.75 10.75Z" fill="currentColor"/>
    </svg>
  `,
  xmark: `
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.53033 5.46967C6.23744 5.17678 5.76256 5.17678 5.46967 5.46967C5.17678 5.76256 5.17678 6.23744 5.46967 6.53033L10.9393 12L5.46967 17.4697C5.17678 17.7626 5.17678 18.2374 5.46967 18.5303C5.76256 18.8232 6.23744 18.8232 6.53033 18.5303L12 13.0607L17.4697 18.5303C17.7626 18.8232 18.2374 18.8232 18.5303 18.5303C18.8232 18.2374 18.8232 17.7626 18.5303 17.4697L13.0607 12L18.5303 6.53033C18.8232 6.23744 18.8232 5.76256 18.5303 5.46967C18.2374 5.17678 17.7626 5.17678 17.4697 5.46967L12 10.9393L6.53033 5.46967Z" fill="currentColor"/>
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
