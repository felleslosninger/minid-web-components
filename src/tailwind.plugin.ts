import plugin from 'tailwindcss/plugin';
import { html, LitElement, unsafeCSS } from 'lit';
import styles from '@digdir/designsystemet-css?inline';
import { CSSObject } from 'storybook/internal/theming';
import { CSSRuleObject } from 'tailwindcss/types/config';

// TODO should we use Tailwind
// plugin(({ addBase, addUtilities, addComponents, e, addVariant, theme }) => {
export const minidWebComponents = () =>
  plugin(() => {
    console.log('hello!');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // addComponents(require(styles));
  });

// '.fds-btn': {
//   '--fds-btn-padding': 'var(--fds-spacing-2) var(--fds-spacing-4)',
//   display: 'flex',
//   alignItems: 'center',
//   border: 'var(--fds-border_width-default) solid transparent',
//   backgroundColor: 'var(--fds-semantic-surface-action-first-default)',
//   color: 'var(--fds-semantic-text-action-first-on_action)',
//   minWidth: '2.5em',
//   padding: 'var(--fds-btn-padding)',
//   boxSizing: 'border-box',
//   cursor: 'pointer',
//   fontFamily: 'inherit',
//   justifyContent: 'center',
//   textAlign: 'center',
//   textDecoration: 'none',
//   position: 'relative',
//   borderRadius: 'var(--fds-border_radius-interactive)',
//   minHeight: 'var(--fds-sizing-10)',
// },
// '.fds-btn svg': { overflow: 'visible' },
// ".fds-btn:disabled,\n        .fds-btn[aria-disabled='true']": {
//   cursor: 'not-allowed',
//   opacity: 'var(--fds-opacity-disabled)',
// },
// '.fds-btn--sm': {
//   '--fds-btn-padding': 'var(--fds-spacing-2) var(--fds-spacing-3)',
//   gap: 'var(--fds-sizing-1)',
//   font: 'var(--fds-typography-paragraph-short-small)',
//   fontFamily: 'inherit',
//   minHeight: 'var(--fds-sizing-10)',
// },
// '.fds-btn--sm::before': {
//   position: 'absolute',
//   top: '0',
//   left: '0',
//   width: 'auto',
//   minHeight: 'auto',
//   content: "''",
// },
// '.fds-btn--sm::after': {
//   position: 'absolute',
//   top: '-5px',
//   left: '0',
//   width: '100%',
//   height: '44px',
//   content: "''",
// },
// '.fds-btn--md': {
//   '--fds-btn-padding': 'var(--fds-spacing-2) var(--fds-spacing-4)',
//   gap: 'var(--fds-sizing-2)',
//   font: 'var(--fds-typography-paragraph-short-medium)',
//   fontFamily: 'inherit',
//   minHeight: 'var(--fds-sizing-12)',
// },
// '.fds-btn--lg': {
//   '--fds-btn-padding': 'var(--fds-spacing-3) var(--fds-spacing-5)',
//   gap: 'var(--fds-sizing-2)',
//   font: 'var(--fds-typography-paragraph-short-large)',
//   fontFamily: 'inherit',
//   minHeight: 'var(--fds-sizing-14)',
// },
// '.fds-btn--full-width': { width: '100%' },
// '.fds-btn--secondary,\n        .fds-btn--tertiary': {
//   backgroundColor: 'transparent',
// },
// '.fds-btn--icon-only': {
//   '--fds-btn-padding': '0',
// },
// '.fds-btn--primary:where(.fds-btn--first)': {
//   backgroundColor: 'var(--fds-semantic-surface-action-first-default)',
// },
// '.fds-btn--primary:where(.fds-btn--second)': {
//   backgroundColor: 'var(--fds-semantic-surface-action-second-default)',
// },
// '.fds-btn--primary:where(.fds-btn--success)': {
//   backgroundColor: 'var(--fds-semantic-surface-success-default)',
// },
// '.fds-btn--primary:where(.fds-btn--danger)': {
//   backgroundColor: 'var(--fds-semantic-surface-danger-default)',
// },
// '@media (hover: hover) and (pointer: fine)': {
//   ".fds-btn--primary:where(.fds-btn--first):not([aria-disabled='true'], :disabled):hover":
//     {
//       backgroundColor: 'var(--fds-semantic-surface-action-first-hover)',
//     },
//   ".fds-btn--primary:where(.fds-btn--second):not([aria-disabled='true'], :disabled):hover":
//     {
//       backgroundColor: 'var(--fds-semantic-surface-action-second-hover)',
//     },
//   ".fds-btn--primary:where(.fds-btn--success):not([aria-disabled='true'], :disabled):hover":
//     {
//       backgroundColor: 'var(--fds-semantic-surface-success-hover)',
//     },
//   ".fds-btn--primary:where(.fds-btn--danger):not([aria-disabled='true'], :disabled):hover":
//     {
//       backgroundColor: 'var(--fds-semantic-surface-danger-hover)',
//     },
//   ".fds-btn--secondary:where(.fds-btn--first):not([aria-disabled='true'], :disabled):hover":
//     {
//       color: 'var(--fds-semantic-text-action-first-hover)',
//       borderColor: 'var(--fds-semantic-border-action-first-hover)',
//       backgroundColor:
//         'var(--fds-semantic-surface-action-first-no_fill-hover)',
//     },
//   ".fds-btn--secondary:where(.fds-btn--second):not([aria-disabled='true'], :disabled):hover":
//     {
//       color: 'var(--fds-semantic-text-action-second-hover)',
//       borderColor: 'var(--fds-semantic-border-action-second-hover)',
//       backgroundColor:
//         'var(--fds-semantic-surface-action-second-no_fill-hover)',
//     },
//   ".fds-btn--secondary:where(.fds-btn--success):not([aria-disabled='true'], :disabled):hover":
//     {
//       color: 'var(--fds-semantic-text-success-hover)',
//       borderColor: 'var(--fds-semantic-border-success-hover)',
//       backgroundColor:
//         'var(--fds-semantic-surface-success-no_fill-hover)',
//     },
//   ".fds-btn--secondary:where(.fds-btn--danger):not([aria-disabled='true'], :disabled):hover":
//     {
//       color: 'var(--fds-semantic-text-danger-hover)',
//       borderColor: 'var(--fds-semantic-border-danger-hover)',
//       backgroundColor: 'var(--fds-semantic-surface-danger-no_fill-hover)',
//     },
//   ".fds-btn--tertiary:where(.fds-btn--first):not([aria-disabled='true'], :disabled):hover":
//     {
//       color: 'var(--fds-semantic-text-action-first-hover)',
//       backgroundColor:
//         'var(--fds-semantic-surface-action-first-no_fill-hover)',
//     },
//   ".fds-btn--tertiary:where(.fds-btn--second):not([aria-disabled='true'], :disabled):hover":
//     {
//       color: 'var(--fds-semantic-text-action-second-hover)',
//       backgroundColor:
//         'var(--fds-semantic-surface-action-second-no_fill-hover)',
//     },
//   ".fds-btn--tertiary:where(.fds-btn--success):not([aria-disabled='true'], :disabled):hover":
//     {
//       color: 'var(--fds-semantic-text-success-hover)',
//       backgroundColor:
//         'var(--fds-semantic-surface-success-no_fill-hover)',
//     },
//   ".fds-btn--tertiary:where(.fds-btn--danger):not([aria-disabled='true'], :disabled):hover":
//     {
//       color: 'var(--fds-semantic-text-danger-hover)',
//       backgroundColor: 'var(--fds-semantic-surface-danger-no_fill-hover)',
//     },
// },
// ".fds-btn--primary:where(.fds-btn--first):not([aria-disabled='true'], :disabled):active":
//   {
//     backgroundColor: 'var(--fds-semantic-surface-action-first-active)',
//   },
// ".fds-btn--primary:where(.fds-btn--second):not([aria-disabled='true'], :disabled):active":
//   {
//     backgroundColor: 'var(--fds-semantic-surface-action-second-active)',
//   },
// ".fds-btn--primary:where(.fds-btn--success):not([aria-disabled='true'], :disabled):active":
//   {
//     backgroundColor: 'var(--fds-semantic-surface-success-active)',
//   },
// ".fds-btn--primary:where(.fds-btn--danger):not([aria-disabled='true'], :disabled):active":
//   {
//     backgroundColor: 'var(--fds-semantic-surface-danger-active)',
//   },
// '.fds-btn--secondary:where(.fds-btn--first)': {
//   color: 'var(--fds-semantic-text-action-first-default)',
//   borderColor: 'var(--fds-semantic-border-action-first-default)',
//   backgroundColor: 'var(--fds-semantic-surface-action-first-no_fill)',
// },
// '.fds-btn--secondary:where(.fds-btn--second)': {
//   color: 'var(--fds-semantic-text-action-second-default)',
//   borderColor: 'var(--fds-semantic-border-action-second-default)',
//   backgroundColor: 'var(--fds-semantic-surface-action-second-no_fill)',
// },
// '.fds-btn--secondary:where(.fds-btn--success)': {
//   color: 'var(--fds-semantic-text-success-default)',
//   borderColor: 'var(--fds-semantic-border-success-default)',
//   backgroundColor: 'var(--fds-semantic-surface-success-no_fill)',
// },
// '.fds-btn--secondary:where(.fds-btn--danger)': {
//   color: 'var(--fds-semantic-text-danger-default)',
//   borderColor: 'var(--fds-semantic-border-danger-default)',
//   backgroundColor: 'var(--fds-semantic-surface-danger-no_fill)',
// },
// ".fds-btn--secondary:where(.fds-btn--first):not([aria-disabled='true'], :disabled):active":
//   {
//     color: 'var(--fds-semantic-text-action-first-active)',
//     borderColor: 'var(--fds-semantic-border-action-first-active)',
//     backgroundColor:
//       'var(--fds-semantic-surface-action-first-no_fill-active)',
//   },
// ".fds-btn--secondary:where(.fds-btn--second):not([aria-disabled='true'], :disabled):active":
//   {
//     color: 'var(--fds-semantic-text-action-second-active)',
//     borderColor: 'var(--fds-semantic-border-action-second-active)',
//     backgroundColor:
//       'var(--fds-semantic-surface-action-second-no_fill-active)',
//   },
// ".fds-btn--secondary:where(.fds-btn--success):not([aria-disabled='true'], :disabled):active":
//   {
//     color: 'var(--fds-semantic-text-success-active)',
//     borderColor: 'var(--fds-semantic-border-success-active)',
//     backgroundColor: 'var(--fds-semantic-surface-success-no_fill-active)',
//   },
// ".fds-btn--secondary:where(.fds-btn--danger):not([aria-disabled='true'], :disabled):active":
//   {
//     color: 'var(--fds-semantic-text-danger-active)',
//     borderColor: 'var(--fds-semantic-border-danger-active)',
//     backgroundColor: 'var(--fds-semantic-surface-danger-no_fill-active)',
//   },
// '.fds-btn--tertiary:where(.fds-btn--first)': {
//   color: 'var(--fds-semantic-text-action-first-default)',
// },
// '.fds-btn--tertiary:where(.fds-btn--second)': {
//   color: 'var(--fds-semantic-text-action-second-default)',
// },
// '.fds-btn--tertiary:where(.fds-btn--success)': {
//   color: 'var(--fds-semantic-text-success-default)',
// },
// '.fds-btn--tertiary:where(.fds-btn--danger)': {
//   color: 'var(--fds-semantic-text-danger-default)',
// },
// ".fds-btn--tertiary:where(.fds-btn--first):not([aria-disabled='true'], :disabled):active":
//   {
//     color: 'var(--fds-semantic-text-action-first-active)',
//     backgroundColor:
//       'var(--fds-semantic-surface-action-first-no_fill-active)',
//   },
// ".fds-btn--tertiary:where(.fds-btn--second):not([aria-disabled='true'], :disabled):active":
//   {
//     color: 'var(--fds-semantic-text-action-second-active)',
//     backgroundColor:
//       'var(--fds-semantic-surface-action-second-no_fill-active)',
//   },
// ".fds-btn--tertiary:where(.fds-btn--success):not([aria-disabled='true'], :disabled):active":
//   {
//     color: 'var(--fds-semantic-text-success-active)',
//     backgroundColor: 'var(--fds-semantic-surface-success-no_fill-active)',
//   },
// ".fds-btn--tertiary:where(.fds-btn--danger):not([aria-disabled='true'], :disabled):active":
//   {
//     color: 'var(--fds-semantic-text-danger-active)',
//     backgroundColor: 'var(--fds-semantic-surface-danger-no_fill-active)',
//   },
