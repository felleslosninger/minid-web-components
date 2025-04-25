import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const run = () => {
  const __filename = fileURLToPath(import.meta.url);
  const projectRoot = path.dirname(__filename) + '/..';
  const cssThemeFile =
    projectRoot + '/node_modules/@digdir/designsystemet-theme/brand/digdir.css';
  const destination = projectRoot + '/src/public/designsystemet-tailwind.css';

  // Read the digdir.css file
  fs.readFile(cssThemeFile, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading css file:', err);
      return;
    }

    const sizeBase = /--ds-size-base: (.+);/g.exec(data)[1];
    const sizeStep = /--ds-size-step: (.+);/g.exec(data)[1];
    const radiusBase = /--ds-border-radius-base: (.+);/g.exec(data)[1];
    const radiusScale = /--ds-border-radius-scale: (.+);/g.exec(data)[1];
    const radiusFull = /--ds-border-radius-full: (.+);/g.exec(data)[1];
    const opacityDisabled = /--ds-opacity-disabled: (.+);/g.exec(data)[1];
    const borderWidth = /--ds-border-width-default: (.+);/g.exec(data)[1];
    const borderWidthFocus = /--ds-border-width-focus: (.+);/g.exec(data)[1];

    const shadowRegex = /--([\w-]*shadow[\w-]*): (.+);/g;
    const colorsRegex =
      /@layer ds\.theme\.color-scheme\.light [\s\S]*? color-scheme: light;/g;
    const colors = colorsRegex
      .exec(data)[0]
      .replaceAll('ds-', '')
      .replaceAll('-default', '');

    // Extract CSS variables and their values
    const typographyRegex = /data-typography="primary"[\s\S]*?}/g;
    const typography = typographyRegex.exec(data)[0].replaceAll('ds', '');
    const fontSizeRegex = /--([\w-]*(?:font-size|body|heading)[\w-]*): (.+);/g;
    const fontPropertiesRegex =
      /--([\w-]*(?:-font-weight-|-letter-spacing-|-line-height-)[\w-]*): (.+);/g;
    const textColorRegex = /--([\w-]*text[\w-]*): (.+);/g;
    const backgroundColorRegex = /--([\w-]*background[\w-]*): (.+);/g;
    const borderColorRegex = /--([\w-]*border[\w-]*): (.+);/g;
    const variableRegex = /--([\w-]*(?:base|surface|focus|link)[\w-]*): (.+);/g;

    const variables = {};
    const textColors = {};
    const backgroundColors = {};
    const borderColors = {};
    const shadows = {};
    const fontSizes = {};
    const fontProperties = {};

    let match;

    while ((match = shadowRegex.exec(data)) !== null) {
      shadows[match[1].replace('ds-', '')] = match[2].trim();
    }

    while ((match = fontSizeRegex.exec(typography)) !== null) {
      fontSizes[
        match[1]
          .replace('-font-size', '')
          .replace('-font-weight', '--font-weight')
          .replace('-letter-spacing', '--letter-spacing')
          .replace('-line-height', '--line-height')
      ] = match[2].trim();
    }

    while ((match = fontPropertiesRegex.exec(typography)) !== null) {
      fontProperties[
        `-${match[1]
          .replace('letter-spacing', 'tracking')
          .replace('line-height', 'leading')}`
      ] = match[2].trim();
    }

    while ((match = textColorRegex.exec(colors)) !== null) {
      textColors[match[1].replace('-text', '')] = match[2].trim();
    }

    while ((match = backgroundColorRegex.exec(colors)) !== null) {
      backgroundColors[match[1].replace('-background', '')] = match[2].trim();
    }

    while ((match = borderColorRegex.exec(colors)) !== null) {
      borderColors[match[1].replace('-border', '')] = match[2].trim();
    }

    while ((match = variableRegex.exec(colors)) !== null) {
      variables[match[1].replace('link-color', 'color-link')] = match[2].trim();
    }

    // Generate the Tailwind theme content
    let themeContent = '@theme {\n';

    themeContent += `  --spacing: calc(${sizeStep} / ${sizeBase} * 1em);\n`;
    themeContent += `  --radius: ${radiusBase};\n`;
    themeContent += `  --radius-sm: min(${radiusBase} * 0.5, ${radiusScale});\n`;
    themeContent += `  --radius-md: min(${radiusBase}, ${radiusScale} * 2);\n`;
    themeContent += `  --radius-lg: min(${radiusBase} * 2, ${radiusScale} * 5);\n`;
    themeContent += `  --radius-xl: min(${radiusBase} * 3, ${radiusScale} * 7);\n`;
    themeContent += `  --radius-full: ${radiusFull};\n`;
    themeContent += `  --opacity-disabled: ${opacityDisabled};\n`;
    themeContent += `  --border-width: ${borderWidth};\n`;
    themeContent += `  --border-width-focus: ${borderWidthFocus};\n`;

    Object.entries(shadows).forEach(([key, value]) => {
      themeContent += `  --${key}: ${value};\n`;
    });

    themeContent += '\n  /****************************** \n';
    themeContent += '  * Typography \n   ';
    themeContent += '******************************/\n';

    themeContent += '  --font-*: initial;\n';
    themeContent += `  --font-sans: 'Inter', 'Arial', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n`;
    themeContent += `  --font-sans--font-feature-settings: 'cv05' 1;\n`;
    themeContent += `  --font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;\n`;

    Object.entries(fontSizes).forEach(([key, value]) => {
      themeContent += `  --text${key}: ${value};\n`;
    });

    Object.entries(fontProperties).forEach(([key, value]) => {
      themeContent += `  ${key}: ${value};\n`;
    });

    themeContent += '\n  /****************************** \n';
    themeContent += '  * Color \n   ';
    themeContent += '******************************/\n';

    themeContent += '  --color-*: initial;\n';
    themeContent += '  --color-white: #fff;\n';
    themeContent += '  --color-black: #000;\n';
    themeContent += '\n';

    Object.entries(variables).forEach(([key, value]) => {
      themeContent += `  --${key}: ${value};\n`;
    });

    themeContent += '\n  /* Text Colors */\n';
    Object.entries(textColors).forEach(([key, value]) => {
      themeContent += `  --text-${key}: ${value};\n`;
    });

    themeContent += '\n  /* Background Colors */\n';
    Object.entries(backgroundColors).forEach(([key, value]) => {
      themeContent += `  --background-${key}: ${value};\n`;
    });

    themeContent += '\n  /* Border Colors */\n';
    Object.entries(borderColors).forEach(([key, value]) => {
      themeContent += `  --border-${key}: ${value};\n`;
    });

    themeContent += '}\n';

    themeContent += '\n@utility focus-ring {\n';
    themeContent +=
      '  @apply ring-focus-inner outline-focus-outer ring-[3px] outline-[3px] outline-offset-[3px];\n';
    themeContent += '}\n';

    // Write the generated theme to the destination file
    fs.writeFile(destination, themeContent, 'utf-8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing theme.css:', writeErr);
      } else {
        console.log('Tailwind theme generated successfully at:', destination);
      }
    });
  });
};

run();
