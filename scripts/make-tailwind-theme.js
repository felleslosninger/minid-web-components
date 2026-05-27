import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * This script combines the auto-generated Tailwind theme from `design-tokens-build/digdir.tailwind.css`
 * with extra Tailwind configurations from `extra-tailwind-config.css`
 * and writes the public CSS entrypoints copied into `dist` by Vite.
 */
const run = () => {
  const __filename = fileURLToPath(import.meta.url);
  const projectRoot = path.resolve(path.dirname(__filename), '..');
  const publicDir = path.join(projectRoot, 'src/public');
  const tailwindThemeFile = path.join(
    projectRoot,
    'design-tokens-build/digdir.tailwind.css'
  );
  const designTokenThemeFile = path.join(
    projectRoot,
    'design-tokens-build/digdir.css'
  );
  const extraTailwindConfigFile = path.join(
    projectRoot,
    'src/styles/extra-tailwind-config.css'
  );
  const tailwindDestination = path.join(
    publicDir,
    'designsystemet-tailwind.css'
  );
  const themeDestination = path.join(publicDir, 'theme.css');
  const stylesDestination = path.join(publicDir, 'styles.css');

  const themeContent = fs.readFileSync(tailwindThemeFile, 'utf-8');
  const designTokenThemeContent = fs.readFileSync(
    designTokenThemeFile,
    'utf-8'
  );
  const extraContent = fs.readFileSync(extraTailwindConfigFile, 'utf-8');
  const stylesContent = [
    '@layer theme, base, ds.theme, ds.base, ds.components, components, utilities;',
    "@import './theme.css' layer(ds.theme);",
    "@import '@digdir/designsystemet-css';",
    "@import './designsystemet-tailwind.css';",
    "@import './index.css' layer(ds.base);",
    '',
  ].join('\n');

  fs.writeFileSync(
    tailwindDestination,
    themeContent + '\n' + extraContent,
    'utf-8'
  );
  fs.writeFileSync(themeDestination, designTokenThemeContent, 'utf-8');
  fs.writeFileSync(stylesDestination, stylesContent, 'utf-8');
  console.log('Tailwind theme generated successfully at:', tailwindDestination);
  console.log('Designsystemet theme copied successfully at:', themeDestination);
  console.log(
    'Styles entrypoint generated successfully at:',
    stylesDestination
  );
};

run();
