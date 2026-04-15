import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * This script combines the auto-generated Tailwind theme from `design-tokens-build/digdir.tailwind.css`
 * with extra Tailwind configurations from `extra-tailwind-config.css`
 * and writes the result to `src/public/designsystemet-tailwind.css`.
 */
const run = () => {
  const __filename = fileURLToPath(import.meta.url);
  const projectRoot = path.dirname(__filename) + '/..';
  const tailwindThemeFile =
    projectRoot + '/design-tokens-build/digdir.tailwind.css';
  const destination = projectRoot + '/src/public/designsystemet-tailwind.css';
  const extraTailwindConfigFile =
    projectRoot + '/src/styles/extra-tailwind-config.css';

  const themeContent = fs.readFileSync(tailwindThemeFile, 'utf-8');
  const extraContent = fs.readFileSync(extraTailwindConfigFile, 'utf-8');

  fs.writeFileSync(destination, themeContent + '\n' + extraContent, 'utf-8');
  console.log('Tailwind theme generated successfully at:', destination);
};

run();
