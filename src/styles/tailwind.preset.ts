import { Config } from 'tailwindcss';

export const dsTailwindPreset = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{html,js,ts}'],
  theme: {
    fontFamily: {
      sans: ['inter', 'Arial', 'sans-serif'],
      serif: ['serif'],
      mono: ['IBM', 'Plex', 'Mono'],
    },
    extend: {
      borderRadius: {
        DEFAULT: 'var(--ds-border-radius-default)',
        full: 'var(--ds-border-radius-full)',
        sm: 'var(--ds-border-radius-sm)',
        md: 'var(--ds-border-radius-md)',
        lg: 'var(--ds-border-radius-lg)',
        xl: 'var(--ds-border-radius-xl)',
      },
      opacity: {
        disabled: 'var(--ds-disabled-opacity)',
      },
      borderWidth: {
        DEFAULT: 'var(--ds-border-width-default)',
        highlight: 'var(--ds-border-width-highlight)',
      },
      boxShadow: {
        xs: 'var(--ds-shadow-xs)',
        sm: 'var(--ds-shadow-sm)',
        DEFAULT: 'var(--ds-shadow-md)',
        lg: 'var(--ds-shadow-lg)',
        xl: 'var(--ds-shadow-xl)',
      },
      spacing: {
        1: 'var(--ds-size-1)',
        2: 'var(--ds-size-2)',
        3: 'var(--ds-size-3)',
        4: 'var(--ds-size-4)',
        5: 'var(--ds-size-5)',
        6: 'var(--ds-size-6)',
        7: 'var(--ds-size-4)',
        8: 'var(--ds-size-8)',
        9: 'var(--ds-size-9)',
        10: 'var(--ds-size-10)',
        11: 'var(--ds-size-11)',
        12: 'var(--ds-size-12)',
        13: 'var(--ds-size-13)',
        14: 'var(--ds-size-14)',
        15: 'var(--ds-size-15)',
        18: 'var(--ds-size-18)',
        22: 'var(--ds-size-22)',
        26: 'var(--ds-size-26)',
        30: 'var(--ds-size-30)',
      },
      tracking: {
        1: 'var(--ds-letter-spacing-1)',
        2: 'var(--ds-letter-spacing-2)',
        3: 'var(--ds-letter-spacing-3)',
        4: 'var(--ds-letter-spacing-4)',
        5: 'var(--ds-letter-spacing-5)',
        6: 'var(--ds-letter-spacing-6)',
        7: 'var(--ds-letter-spacing-7)',
        8: 'var(--ds-letter-spacing-8)',
        9: 'var(--ds-letter-spacing-9)',
      },
      lineHeight: {
        sm: 'var(--ds-line-height-sm)',
        md: 'var(--ds-line-height-md)',
        lg: 'var(--ds-line-height-lg)',
      },
      fontSize: {
        1: 'var(--ds-font-size-1)',
        2: 'var(--ds-font-size-2)',
        3: 'var(--ds-font-size-3)',
        4: 'var(--ds-font-size-4)',
        5: 'var(--ds-font-size-5)',
        6: 'var(--ds-font-size-6)',
        7: 'var(--ds-font-size-7)',
        8: 'var(--ds-font-size-8)',
        9: 'var(--ds-font-size-9)',
        10: 'var(--ds-font-size-10)',
        11: 'var(--ds-font-size-11)',
        'heading-2xl': [
          'var(--ds-heading-2xl-font-size)',
          {
            fontWeight: 'var(--ds-heading-2xl-font-weight)',
            letterSpacing: 'var(--ds-heading-2xl-letter-spacing)',
            lineHeight: 'var(--ds-heading-2xl-line-height)',
          },
        ],
        'heading-xl': [
          'var(--ds-heading-xl-font-size)',
          {
            fontWeight: 'var(--ds-heading-xl-font-weight)',
            letterSpacing: 'var(--ds-heading-xl-letter-spacing)',
            lineHeight: 'var(--ds-heading-xl-line-height)',
          },
        ],
        'heading-lg': [
          'var(--ds-heading-lg-font-size)',
          {
            fontWeight: 'var(--ds-heading-lg-font-weight)',
            letterSpacing: 'var(--ds-heading-lg-letter-spacing)',
            lineHeight: 'var(--ds-heading-lg-line-height)',
          },
        ],
        'heading-md': [
          'var(--ds-heading-md-font-size)',
          {
            fontWeight: 'var(--ds-heading-md-font-weight)',
            letterSpacing: 'var(--ds-heading-md-letter-spacing)',
            lineHeight: 'var(--ds-heading-md-line-height)',
          },
        ],
        'heading-sm': [
          'var(--ds-heading-sm-font-size)',
          {
            fontWeight: 'var(--ds-heading-sm-font-weight)',
            letterSpacing: 'var(--ds-heading-sm-letter-spacing)',
            lineHeight: 'var(--ds-heading-sm-line-height)',
          },
        ],
        'heading-xs': [
          'var(--ds-heading-xs-font-size)',
          {
            fontWeight: 'var(--ds-heading-xs-font-weight)',
            letterSpacing: 'var(--ds-heading-xs-letter-spacing)',
            lineHeight: 'var(--ds-heading-xs-line-height)',
          },
        ],
        'heading-2xs': [
          'var(--ds-heading-2xs-font-size)',
          {
            fontWeight: 'var(--ds-heading-2xs-font-weight)',
            letterSpacing: 'var(--ds-heading-2xs-letter-spacing)',
            lineHeight: 'var(--ds-heading-2xs-line-height)',
          },
        ],
        'body-xl': [
          'var(--ds-body-xl-font-size)',
          {
            fontWeight: 'var(--ds-body-xl-font-weight)',
            letterSpacing: 'var(--ds-body-xl-letter-spacing)',
            lineHeight: 'var(--ds-body-xl-line-height)',
          },
        ],
        'body-lg': [
          'var(--ds-body-lg-font-size)',
          {
            fontWeight: 'var(--ds-body-lg-font-weight)',
            letterSpacing: 'var(--ds-body-lg-letter-spacing)',
            lineHeight: 'var(--ds-body-lg-line-height)',
          },
        ],
        'body-md': [
          'var(--ds-body-md-font-size)',
          {
            fontWeight: 'var(--ds-body-md-font-weight)',
            letterSpacing: 'var(--ds-body-md-letter-spacing)',
            lineHeight: 'var(--ds-body-md-line-height)',
          },
        ],
        'body-sm': [
          'var(--ds-body-sm-font-size)',
          {
            fontWeight: 'var(--ds-body-sm-font-weight)',
            letterSpacing: 'var(--ds-body-sm-letter-spacing)',
            lineHeight: 'var(--ds-body-sm-line-height)',
          },
        ],
        'body-xs': [
          'var(--ds-body-xs-font-size)',
          {
            fontWeight: 'var(--ds-body-xs-font-weight)',
            letterSpacing: 'var(--ds-body-xs-letter-spacing)',
            lineHeight: 'var(--ds-body-xs-line-height)',
          },
        ],
        'body-short-xl': [
          'var(--ds-body-short-xl-font-size)',
          {
            fontWeight: 'var(--ds-body-short-xl-font-weight)',
            letterSpacing: 'var(--ds-body-short-xl-letter-spacing)',
            lineHeight: 'var(--ds-body-short-xl-line-height)',
          },
        ],
        'body-short-lg': [
          'var(--ds-body-short-lg-font-size)',
          {
            fontWeight: 'var(--ds-body-short-lg-font-weight)',
            letterSpacing: 'var(--ds-body-short-lg-letter-spacing)',
            lineHeight: 'var(--ds-body-short-lg-line-height)',
          },
        ],
        'body-short-md': [
          'var(--ds-body-short-md-font-size)',
          {
            fontWeight: 'var(--ds-body-short-md-font-weight)',
            letterSpacing: 'var(--ds-body-short-md-letter-spacing)',
            lineHeight: 'var(--ds-body-short-md-line-height)',
          },
        ],
        'body-short-sm': [
          'var(--ds-body-short-sm-font-size)',
          {
            fontWeight: 'var(--ds-body-short-sm-font-weight)',
            letterSpacing: 'var(--ds-body-short-sm-letter-spacing)',
            lineHeight: 'var(--ds-body-short-sm-line-height)',
          },
        ],
        'body-short-xs': [
          'var(--ds-body-short-xs-font-size)',
          {
            fontWeight: 'var(--ds-body-short-xs-font-weight)',
            letterSpacing: 'var(--ds-body-short-xs-letter-spacing)',
            lineHeight: 'var(--ds-body-short-xs-line-height)',
          },
        ],
        'body-long-xl': [
          'var(--ds-body-long-xl-font-size)',
          {
            fontWeight: 'var(--ds-body-long-xl-font-weight)',
            letterSpacing: 'var(--ds-body-long-xl-letter-spacing)',
            lineHeight: 'var(--ds-body-long-xl-line-height)',
          },
        ],
        'body-long-lg': [
          'var(--ds-body-long-lg-font-size)',
          {
            fontWeight: 'var(--ds-body-long-lg-font-weight)',
            letterSpacing: 'var(--ds-body-long-lg-letter-spacing)',
            lineHeight: 'var(--ds-body-long-lg-line-height)',
          },
        ],
        'body-long-md': [
          'var(--ds-body-long-md-font-size)',
          {
            fontWeight: 'var(--ds-body-long-md-font-weight)',
            letterSpacing: 'var(--ds-body-long-md-letter-spacing)',
            lineHeight: 'var(--ds-body-long-md-line-height)',
          },
        ],
        'body-long-sm': [
          'var(--ds-body-long-sm-font-size)',
          {
            fontWeight: 'var(--ds-body-long-sm-font-weight)',
            letterSpacing: 'var(--ds-body-long-sm-letter-spacing)',
            lineHeight: 'var(--ds-body-long-sm-line-height)',
          },
        ],
        'body-long-xs': [
          'var(--ds-body-long-xs-font-size)',
          {
            fontWeight: 'var(--ds-body-long-xs-font-weight)',
            letterSpacing: 'var(--ds-body-long-xs-letter-spacing)',
            lineHeight: 'var(--ds-body-long-xs-line-height)',
          },
        ],
      },
      colors: {
        blue: {
          1: 'var(--ds-global-blue-1)',
          2: 'var(--ds-global-blue-2)',
          3: 'var(--ds-global-blue-3)',
          4: 'var(--ds-global-blue-4)',
          5: 'var(--ds-global-blue-5)',
          6: 'var(--ds-global-blue-6)',
          7: 'var(--ds-global-blue-7)',
          8: 'var(--ds-global-blue-8)',
          9: 'var(--ds-global-blue-9)',
          10: 'var(--ds-global-blue-10)',
          11: 'var(--ds-global-blue-11)',
          12: 'var(--ds-global-blue-12)',
          13: 'var(--ds-global-blue-13)',
          contrast: {
            1: 'var(--ds-global-blue-contrast-1)',
            2: 'var(--ds-global-blue-contrast-2)',
          },
        },
        green: {
          1: 'var(--ds-global-green-1)',
          2: 'var(--ds-global-green-2)',
          3: 'var(--ds-global-green-3)',
          4: 'var(--ds-global-green-4)',
          5: 'var(--ds-global-green-5)',
          6: 'var(--ds-global-green-6)',
          7: 'var(--ds-global-green-7)',
          8: 'var(--ds-global-green-8)',
          9: 'var(--ds-global-green-9)',
          10: 'var(--ds-global-green-10)',
          11: 'var(--ds-global-green-11)',
          12: 'var(--ds-global-green-12)',
          13: 'var(--ds-global-green-13)',
          contrast: {
            1: 'var(--ds-global-green-contrast-1)',
            2: 'var(--ds-global-green-contrast-2)',
          },
        },
        orange: {
          1: 'var(--ds-global-orange-1)',
          2: 'var(--ds-global-orange-2)',
          3: 'var(--ds-global-orange-3)',
          4: 'var(--ds-global-orange-4)',
          5: 'var(--ds-global-orange-5)',
          6: 'var(--ds-global-orange-6)',
          7: 'var(--ds-global-orange-7)',
          8: 'var(--ds-global-orange-8)',
          9: 'var(--ds-global-orange-9)',
          10: 'var(--ds-global-orange-10)',
          11: 'var(--ds-global-orange-11)',
          12: 'var(--ds-global-orange-12)',
          13: 'var(--ds-global-orange-13)',
          contrast: {
            1: 'var(--ds-global-orange-contrast-1)',
            2: 'var(--ds-global-orange-contrast-2)',
          },
        },
        purple: {
          1: 'var(--ds-global-purple-1)',
          2: 'var(--ds-global-purple-2)',
          3: 'var(--ds-global-purple-3)',
          4: 'var(--ds-global-purple-4)',
          5: 'var(--ds-global-purple-5)',
          6: 'var(--ds-global-purple-6)',
          7: 'var(--ds-global-purple-7)',
          8: 'var(--ds-global-purple-8)',
          9: 'var(--ds-global-purple-9)',
          10: 'var(--ds-global-purple-10)',
          11: 'var(--ds-global-purple-11)',
          12: 'var(--ds-global-purple-12)',
          13: 'var(--ds-global-purple-13)',
          contrast: {
            1: 'var(--ds-global-purple-contrast-1)',
            2: 'var(--ds-global-purple-contrast-2)',
          },
        },
        red: {
          1: 'var(--ds-global-red-1)',
          2: 'var(--ds-global-red-2)',
          3: 'var(--ds-global-red-3)',
          4: 'var(--ds-global-red-4)',
          5: 'var(--ds-global-red-5)',
          6: 'var(--ds-global-red-6)',
          7: 'var(--ds-global-red-7)',
          8: 'var(--ds-global-red-8)',
          9: 'var(--ds-global-red-9)',
          10: 'var(--ds-global-red-10)',
          11: 'var(--ds-global-red-11)',
          12: 'var(--ds-global-red-12)',
          13: 'var(--ds-global-red-13)',
          contrast: {
            1: 'var(--ds-global-red-contrast-1)',
            2: 'var(--ds-global-red-contrast-2)',
          },
        },
        yellow: {
          1: 'var(--ds-global-yellow-1)',
          2: 'var(--ds-global-yellow-2)',
          3: 'var(--ds-global-yellow-3)',
          4: 'var(--ds-global-yellow-4)',
          5: 'var(--ds-global-yellow-5)',
          6: 'var(--ds-global-yellow-6)',
          7: 'var(--ds-global-yellow-7)',
          8: 'var(--ds-global-yellow-8)',
          9: 'var(--ds-global-yellow-9)',
          10: 'var(--ds-global-yellow-10)',
          11: 'var(--ds-global-yellow-11)',
          12: 'var(--ds-global-yellow-12)',
          13: 'var(--ds-global-yellow-13)',
          contrast: {
            1: 'var(--ds-global-yellow-contrast-1)',
            2: 'var(--ds-global-yellow-contrast-2)',
          },
        },
        accent: {
          surface: {
            DEFAULT: 'var(--ds-color-accent-surface-default)',
            hover: 'var(--ds-color-accent-surface-hover)',
            active: 'var(--ds-color-accent-surface-active)',
          },
          base: {
            DEFAULT: 'var(--ds-color-accent-base-default)',
            hover: 'var(--ds-color-accent-base-hover)',
            active: 'var(--ds-color-accent-base-active)',
          },
        },
        brand1: {
          surface: {
            DEFAULT: 'var(--ds-color-brand1-surface-default)',
            hover: 'var(--ds-color-brand1-surface-hover)',
            active: 'var(--ds-color-brand1-surface-active)',
          },
          base: {
            DEFAULT: 'var(--ds-color-brand1-base-default)',
            hover: 'var(--ds-color-brand1-base-hover)',
            active: 'var(--ds-color-brand1-base-active)',
          },
        },
        brand2: {
          surface: {
            DEFAULT: 'var(--ds-color-brand2-surface-default)',
            hover: 'var(--ds-color-brand2-surface-hover)',
            active: 'var(--ds-color-brand2-surface-active)',
          },
          base: {
            DEFAULT: 'var(--ds-color-brand2-base-default)',
            hover: 'var(--ds-color-brand2-base-hover)',
            active: 'var(--ds-color-brand2-base-active)',
          },
        },
        brand3: {
          DEFAULT: 'hotpink',
          surface: {
            DEFAULT: 'var(--ds-color-brand3-surface-default)',
            hover: 'var(--ds-color-brand3-surface-hover)',
            active: 'var(--ds-color-brand3-surface-active)',
          },
          base: {
            DEFAULT: 'var(--ds-color-brand3-base-default)',
            hover: 'var(--ds-color-brand3-base-hover)',
            active: 'var(--ds-color-brand3-base-active)',
          },
        },
        danger: {
          surface: {
            DEFAULT: 'var(--ds-color-danger-surface-default)',
            hover: 'var(--ds-color-danger-surface-hover)',
            active: 'var(--ds-color-danger-surface-active)',
          },
          base: {
            DEFAULT: 'var(--ds-color-danger-base-default)',
            hover: 'var(--ds-color-danger-base-hover)',
            active: 'var(--ds-color-danger-base-active)',
          },
        },
        info: {
          surface: {
            DEFAULT: 'var(--ds-color-info-surface-default)',
            hover: 'var(--ds-color-info-surface-hover)',
            active: 'var(--ds-color-info-surface-active)',
          },
          base: {
            DEFAULT: 'var(--ds-color-info-base-default)',
            hover: 'var(--ds-color-info-base-hover)',
            active: 'var(--ds-color-info-base-active)',
          },
        },
        neutral: {
          surface: {
            DEFAULT: 'var(--ds-color-neutral-surface-default)',
            hover: 'var(--ds-color-neutral-surface-hover)',
            active: 'var(--ds-color-neutral-surface-active)',
          },
          base: {
            DEFAULT: 'var(--ds-color-neutral-base-default)',
            hover: 'var(--ds-color-neutral-base-hover)',
            active: 'var(--ds-color-neutral-base-active)',
          },
        },
        success: {
          surface: {
            DEFAULT: 'var(--ds-color-success-surface-default)',
            hover: 'var(--ds-color-success-surface-hover)',
            active: 'var(--ds-color-success-surface-active)',
          },
          base: {
            DEFAULT: 'var(--ds-color-success-base-default)',
            hover: 'var(--ds-color-success-base-hover)',
            active: 'var(--ds-color-success-base-active)',
          },
        },
        warning: {
          surface: {
            DEFAULT: 'var(--ds-color-warning-surface-default)',
            hover: 'var(--ds-color-warning-surface-hover)',
            active: 'var(--ds-color-warning-surface-active)',
          },
          base: {
            DEFAULT: 'var(--ds-color-warning-base-default)',
            hover: 'var(--ds-color-warning-base-hover)',
            active: 'var(--ds-color-warning-base-active)',
          },
        },
        focus: {
          inner: 'var(--ds-color-focus-inner)',
          outer: 'var(--ds-color-focus-outer)',
        },
      },
      backgroundColor: {
        accent: {
          DEFAULT: 'var(--ds-color-accent-background-default)',
          subtle: 'var(--ds-color-accent-background-subtle)',
        },
        brand1: {
          DEFAULT: 'var(--ds-color-brand1-background-default)',
          subtle: 'var(--ds-color-brand1-background-subtle)',
        },
        brand2: {
          DEFAULT: 'var(--ds-color-brand2-background-default)',
          subtle: 'var(--ds-color-brand2-background-subtle)',
        },
        brand3: {
          DEFAULT: 'var(--ds-color-brand3-background-default)',
          subtle: 'var(--ds-color-brand3-background-subtle)',
        },
        danger: {
          DEFAULT: 'var(--ds-color-danger-background-default)',
          subtle: 'var(--ds-color-danger-background-subtle)',
        },
        info: {
          DEFAULT: 'var(--ds-color-info-background-default)',
          subtle: 'var(--ds-color-info-background-subtle)',
        },
        neutral: {
          DEFAULT: 'var(--ds-color-neutral-background-default)',
          subtle: 'var(--ds-color-neutral-background-subtle)',
        },
        success: {
          DEFAULT: 'var(--ds-color-success-background-default)',
          subtle: 'var(--ds-color-success-background-subtle)',
        },
        warning: {
          DEFAULT: 'var(--ds-color-warning-background-default)',
          subtle: 'var(--ds-color-warning-background-subtle)',
        },
      },
      borderColor: {
        accent: {
          DEFAULT: 'var(--ds-color-accent-border-default)',
          subtle: 'var(--ds-color-accent-border-subtle)',
          strong: 'var(--ds-color-accent-border-strong)',
        },
        brand1: {
          DEFAULT: 'var(--ds-color-brand1-border-default)',
          subtle: 'var(--ds-color-brand1-border-subtle)',
          strong: 'var(--ds-color-brand1-border-strong)',
        },
        brand2: {
          DEFAULT: 'var(--ds-color-brand2-border-default)',
          subtle: 'var(--ds-color-brand2-border-subtle)',
          strong: 'var(--ds-color-brand2-border-strong)',
        },
        brand3: {
          DEFAULT: 'var(--ds-color-brand3-border-default)',
          subtle: 'var(--ds-color-brand3-border-subtle)',
          strong: 'var(--ds-color-brand3-border-strong)',
        },
        danger: {
          DEFAULT: 'var(--ds-color-danger-border-default)',
          subtle: 'var(--ds-color-danger-border-subtle)',
          strong: 'var(--ds-color-danger-border-strong)',
        },
        info: {
          DEFAULT: 'var(--ds-color-info-border-default)',
          subtle: 'var(--ds-color-info-border-subtle)',
          strong: 'var(--ds-color-info-border-strong)',
        },
        neutral: {
          DEFAULT: 'var(--ds-color-neutral-border-default)',
          subtle: 'var(--ds-color-neutral-border-subtle)',
          strong: 'var(--ds-color-neutral-border-strong)',
        },
        success: {
          DEFAULT: 'var(--ds-color-success-border-default)',
          subtle: 'var(--ds-color-success-border-subtle)',
          strong: 'var(--ds-color-success-border-strong)',
        },
        warning: {
          DEFAULT: 'var(--ds-color-warning-border-default)',
          subtle: 'var(--ds-color-warning-border-subtle)',
          strong: 'var(--ds-color-warning-border-strong)',
        },
      },
      textColor: {
        accent: {
          DEFAULT: 'var(--ds-color-accent-text-default)',
          subtle: 'var(--ds-color-accent-text-subtle)',
        },
        brand1: {
          DEFAULT: 'var(--ds-color-brand1-text-default)',
          subtle: 'var(--ds-color-brand1-text-subtle)',
        },
        brand2: {
          DEFAULT: 'var(--ds-color-brand2-text-default)',
          subtle: 'var(--ds-color-brand2-text-subtle)',
        },
        brand3: {
          DEFAULT: 'var(--ds-color-brand3-text-default)',
          subtle: 'var(--ds-color-brand3-text-subtle)',
        },
        danger: {
          DEFAULT: 'var(--ds-color-danger-text-default)',
          subtle: 'var(--ds-color-danger-text-subtle)',
        },
        info: {
          DEFAULT: 'var(--ds-color-info-text-default)',
          subtle: 'var(--ds-color-info-text-subtle)',
        },
        neutral: {
          DEFAULT: 'var(--ds-color-neutral-text-default)',
          subtle: 'var(--ds-color-neutral-text-subtle)',
        },
        success: {
          DEFAULT: 'var(--ds-color-success-text-default)',
          subtle: 'var(--ds-color-success-text-subtle)',
        },
        warning: {
          DEFAULT: 'var(--ds-color-warning-text-default)',
          subtle: 'var(--ds-color-warning-text-subtle)',
        },
      },
    },
  },
} satisfies Config;
