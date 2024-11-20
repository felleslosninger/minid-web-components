// import { minidWebComponents } from './src/tailwind.plugin';
import type { Config } from 'tailwindcss';

const blue = {
  1: '#fefeff',
  2: '#edf5fa',
  3: '#d3e5f4',
  4: '#b7d5ed',
  5: '#9bc5e5',
  6: '#94c1e3',
  7: '#2f86c9',
  8: '#075089',
  9: '#0A71C0',
  10: '#085ea0',
  11: '#074b80',
  12: '#0966ac',
  13: '#042d4d',
  contrast: {
    1: '#ffffff',
    2: '#f3f8fc',
  },
};

const action = {
  2: '#e6eff8',
  3: '#0062BA',
  4: '#004e95',
  13: '#00315d',
};

const green = {
  1: '#fcfefc',
  2: '#ecf6ed',
  3: '#cfe9d3',
  4: '#b3dcb8',
  5: '#95ce9d',
  6: '#8bca94',
  7: '#189528',
  8: '#045a10',
  9: '#078D19',
  10: '#067615',
  11: '#056011',
  12: '#067314',
  13: '#033409',
  contrast: {
    1: '#000000',
    2: '#000401',
  },
};

const orange = {
  1: '#fffefd',
  2: '#fbf1ec',
  3: '#f4ddd0',
  4: '#eecab7',
  5: '#e7b69c',
  6: '#e5b094',
  7: '#cc632b',
  8: '#7e3a15',
  9: '#CA5C21',
  10: '#a94d1c',
  11: '#8a3f17',
  12: '#a1491a',
  13: '#47210c',
  contrast: {
    1: '#000000',
    2: '#0d0602',
  },
};

const purple = {
  1: '#fefefe',
  2: '#f5f2f9',
  3: '#e7dfef',
  4: '#d9cce6',
  5: '#ccbadd',
  6: '#c7b4da',
  7: '#9572b9',
  8: '#663399',
  9: '#663299',
  10: '#4f2777',
  11: '#381b54',
  12: '#7b4ea7',
  13: '#3b1d59',
  contrast: {
    1: '#ffffff',
    2: '#eee8f3',
  },
};

const red = {
  1: '#fffefe',
  2: '#fbf1f1',
  3: '#f5dcdc',
  4: '#f0c7c7',
  5: '#eab3b3',
  6: '#e8acac',
  7: '#d25b5b',
  8: '#9a1616',
  9: '#C01B1B',
  10: '#9a1616',
  11: '#771111',
  12: '#c22020',
  13: '#5a0d0d',
  contrast: {
    1: '#ffffff',
    2: '#f6dfdf',
  },
};

const yellow = {
  1: '#fffefc',
  2: '#fbf2d3',
  3: '#f5e19b',
  4: '#efcf5d',
  5: '#e6bc27',
  6: '#e0b726',
  7: '#9a7e1a',
  8: '#5d4c10',
  9: '#EABF28',
  10: '#d0aa24',
  11: '#b7951f',
  12: '#776114',
  13: '#352b09',
  contrast: {
    1: '#000000',
    2: '#382d0a',
  },
};

const accent = {
  1: '#fefeff',
  2: '#eef4fa',
  3: '#d1e3f3',
  4: '#bad5ec',
  5: '#a1c5e5',
  6: '#97bfe3',
  7: '#3885c9',
  8: '#014e93',
  9: '#0163ba',
  10: '#015097',
  11: '#013f75',
  12: '#0163ba',
  13: '#002d54',
  contrast: {
    1: '#ffffff',
    2: '#dbe9f5',
  },
};

const neutral = {
  1: '#fefefe',
  2: '#f3f4f5',
  3: '#e1e3e5',
  4: '#ced1d4',
  5: '#bdc1c6',
  6: '#b8bcc1',
  7: '#7a818c',
  8: '#444e5d',
  9: '#1e2b3c',
  10: '#303c4b',
  11: '#444e5d',
  12: '#5b6471',
  13: '#202c3d',
  contrast: {
    1: '#ffffff',
    2: '#bbbfc4',
  },
};

const brand1 = {
  1: '#fffefe',
  2: '#fef0f1',
  3: '#fcdbdc',
  4: '#fbc4c5',
  5: '#f9acae',
  6: '#f8a5a7',
  7: '#d95558',
  8: '#833336',
  9: '#f35f63',
  10: '#d05255',
  11: '#af4547',
  12: '#a74144',
  13: '#4b1e1f',
  contrast: {
    1: '#000000',
    2: '#000000',
  },
};

const brand2 = {
  1: '#fffefc',
  2: '#fbf3e0',
  3: '#f5dfad',
  4: '#f0ce7f',
  5: '#e9ba4c',
  6: '#e7b43d',
  7: '#a57a17',
  8: '#63490e',
  9: '#e4a920',
  10: '#c9951c',
  11: '#af8119',
  12: '#7e5d12',
  13: '#382a08',
  contrast: {
    1: '#000000',
    2: '#2b2006',
  },
};

const brand3 = {
  1: '#fdfeff',
  2: '#eaf6fe',
  3: '#c8e6fd',
  4: '#a9d7fb',
  5: '#84c7fa',
  6: '#7ac2f9',
  7: '#1a85d6',
  8: '#105082',
  9: '#1e98f5',
  10: '#1a83d3',
  11: '#166eb2',
  12: '#1466a5',
  13: '#092e4b',
  contrast: {
    1: '#000000',
    2: '#010407',
  },
};

const background = {
  accent: {
    DEFAULT: accent['1'],
    subtle: accent['2'],
  },
  action: {
    subtle: action['2'],
  },
  brand1: {
    DEFAULT: brand1['1'],
    subtle: brand1['2'],
  },
  brand2: {
    DEFAULT: brand2['1'],
    subtle: brand2['2'],
  },
  brand3: {
    DEFAULT: brand3['1'],
    subtle: brand3['2'],
  },
  danger: {
    DEFAULT: red['1'],
    subtle: red['2'],
  },
  info: {
    DEFAULT: '#fefeff',
    subtle: '#edf5fa',
  },
  neutral: {
    DEFAULT: neutral['1'],
    subtle: neutral['2'],
  },
  success: {
    DEFAULT: green['1'],
    subtle: green['2'],
  },
  warning: {
    DEFAULT: yellow['1'],
    subtle: yellow['2'],
  },
};

const surface = {
  accent: {
    DEFAULT: accent['3'],
    hover: accent['4'],
    active: accent['5'],
  },
  action: {
    DEFAULT: action['3'],
    hover: action['4'],
  },
  brand1: {
    DEFAULT: brand1['3'],
    hover: brand1['4'],
    active: brand1['5'],
  },
  brand2: {
    DEFAULT: brand2['3'],
    hover: brand2['4'],
    active: brand2['5'],
  },
  brand3: {
    DEFAULT: brand3['3'],
    hover: brand3['4'],
    active: brand3['5'],
  },
  danger: {
    DEFAULT: red['3'],
    hover: red['4'],
    active: red['5'],
  },
  info: {
    DEFAULT: '#d3e5f4',
    hover: '#b7d5ed',
    active: '#9bc5e5',
  },
  neutral: {
    DEFAULT: neutral['3'],
    hover: neutral['4'],
    active: neutral['5'],
  },
  success: {
    DEFAULT: green['3'],
    hover: green['4'],
    active: green['5'],
  },
  warning: {
    DEFAULT: yellow['3'],
    hover: yellow['4'],
    active: yellow['5'],
  },
};

const border = {
  accent: {
    DEFAULT: accent['7'],
    subtle: accent['6'],
    strong: accent['8'],
  },
  action: {
    DEFAULT: action['3'],
  },
  brand1: {
    DEFAULT: brand1['7'],
    subtle: brand1['6'],
    strong: brand1['8'],
  },
  brand2: {
    DEFAULT: brand2['7'],
    subtle: brand2['6'],
    strong: brand2['8'],
  },
  brand3: {
    DEFAULT: brand3['7'],
    subtle: brand3['6'],
    strong: brand3['8'],
  },
  danger: {
    DEFAULT: red['7'],
    subtle: red['6'],
    strong: red['8'],
  },
  info: {
    DEFAULT: '#2f86c9',
    subtle: '#94c1e3',
    strong: '#075089',
  },
  neutral: {
    DEFAULT: neutral['7'],
    subtle: neutral['6'],
    strong: neutral['8'],
  },
  success: {
    DEFAULT: green['7'],
    subtle: green['6'],
    strong: green['8'],
  },
  warning: {
    DEFAULT: yellow['7'],
    subtle: yellow['6'],
    strong: yellow['8'],
  },
};

const base = {
  accent: {
    DEFAULT: accent['9'],
    active: accent['11'],
    hover: accent['10'],
  },
  brand1: {
    DEFAULT: brand1['9'],
    active: brand1['11'],
    hover: brand1['10'],
  },
  brand2: {
    DEFAULT: brand2['9'],
    active: brand2['11'],
    hover: brand2['10'],
  },
  brand3: {
    DEFAULT: brand3['9'],
    active: brand3['11'],
    hover: brand3['10'],
  },
  danger: {
    DEFAULT: red['9'],
    active: red['11'],
    hover: red['10'],
  },
  info: {
    DEFAULT: '#0A71C0',
    active: '#074b80',
    hover: '#085ea0',
  },
  neutral: {
    DEFAULT: neutral['9'],
    active: neutral['11'],
    hover: neutral['10'],
  },
  success: {
    DEFAULT: green['9'],
    active: green['11'],
    hover: green['10'],
  },
  warning: {
    DEFAULT: orange['9'],
    active: orange['11'],
    hover: orange['10'],
  },
};

const text = {
  accent: {
    DEFAULT: accent['13'],
    subtle: accent['12'],
  },
  action: {
    DEFAULT: action['3'],
    hover: action['4'],
    active: action['13'],
  },
  brand1: {
    DEFAULT: brand1['13'],
    subtle: brand1['12'],
  },
  brand2: {
    DEFAULT: brand2['13'],
    subtle: brand2['12'],
  },
  brand3: {
    DEFAULT: brand3['13'],
    subtle: brand3['12'],
  },
  danger: {
    DEFAULT: red['13'],
    subtle: red['12'],
  },
  info: {
    DEFAULT: '#0966ac',
    subtle: '#042d4d',
  },
  neutral: {
    DEFAULT: neutral['13'],
    subtle: neutral['12'],
  },
  success: {
    DEFAULT: green['13'],
    subtle: green['12'],
  },
  warning: {
    DEFAULT: orange['13'],
    subtle: orange['12'],
  },
  visited: {
    DEFAULT: '#7a1265',
  },
};

const contrast = {
  accent: {
    DEFAULT: accent.contrast['1'],
    subtle: accent.contrast['2'],
  },
  brand1: {
    DEFAULT: brand1.contrast['1'],
    subtle: brand1.contrast['2'],
  },
  brand2: {
    DEFAULT: brand2.contrast['1'],
    subtle: brand2.contrast['2'],
  },
  brand3: {
    DEFAULT: brand3.contrast['1'],
    subtle: brand3.contrast['2'],
  },
  danger: {
    DEFAULT: red.contrast['1'],
    subtle: red.contrast['2'],
  },
  info: {
    DEFAULT: '#ffffff',
    subtle: '#f3f8fc',
  },
  neutral: {
    DEFAULT: neutral.contrast['1'],
    subtle: neutral.contrast['2'],
  },
  success: {
    DEFAULT: green.contrast['1'],
    subtle: green.contrast['2'],
  },
  warning: {
    DEFAULT: yellow.contrast['1'],
    subtle: yellow.contrast['2'],
  },
};

const focus = {
  inner: '#fefefe',
  outer: '#002d54',
  yellow: '#ffda06',
};

/** @type {import("tailwindcss").Config} */
export default {
  // plugins: [minidWebComponents()],
  plugins: [],
  darkMode: 'class',
  content: ['./src/**/*.ts'],
  theme: {
    fontFamily: {
      sans: ['inter', 'Arial', 'sans-serif'],
      serif: ['serif'],
    },
    extend: {
      colors: {
        accent,
        background,
        base,
        blue,
        border,
        brand1,
        brand2,
        brand3,
        contrast,
        focus,
        green,
        neutral,
        orange,
        purple,
        red,
        surface,
        text,
        yellow,
      },
      ringColor: {
        focus: neutral['9'],
      },
      outlineOffset: {
        3: '3px',
      },
      outlineWidth: {
        3: '3px',
      },
      boxShadow: {
        'focus-visible': '0 0 0 3px #00347d',
      },
      animation: {
        dash: 'dash 1.4s cubic-bezier(0.2,-0.01, 0.51, 0.96) infinite',
        'spin-slow': 'spin 2.2s linear infinite',
      },
      keyframes: {
        dash: {
          '0%': {
            strokeDasharray: '1, 150',
            strokeDashoffset: '0',
          },
          '50%': {
            strokeDasharray: '90, 150',
            strokeDashoffset: '-35',
          },
          '100%': {
            strokeDasharray: '90, 150',
            strokeDashoffset: '-124',
          },
        },
      },
    },
  },
} satisfies Config;
