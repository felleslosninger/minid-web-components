// TODO: Make this part of the dev / build process

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const run = () => {
  const __filename = fileURLToPath(import.meta.url);
  const projectRoot = path.dirname(__filename) + '/..';
  const iconSrcFolder =
    projectRoot + '/node_modules/@navikt/aksel-icons/dist/svg';
  const destination = projectRoot + '/src/assets/icons';
  const tsDestination = projectRoot + '/src/types';
  const tsFileName = tsDestination + '/icon-name.ts';

  fs.readdir(iconSrcFolder, { recursive: true }, (err, files) => {
    let tsContent = 'export type MidIconName = \n\t|';
    files.forEach((file) => {
      if (file.endsWith('.svg')) {
        const fileName = file.substring(0, file.indexOf('.svg'));
        const kebabCase = fileName
          .replace(/([a-z0–9])([A-Z])/g, '$1-$2')
          .toLowerCase();
        tsContent += " '" + kebabCase + "'\n\t|";

        fs.copyFile(
          iconSrcFolder + '/' + file,
          destination + '/' + kebabCase + '.svg',
          (err) => {
            if (err) {
              console.log('Error Found:', err);
            } else {
              // Get the current filenames
              // after the function
              console.log('\nCopied file:', kebabCase + '.svg');
            }
          }
        );
      }
    });

    if (tsContent.endsWith('|')) {
      tsContent = tsContent.substring(0, tsContent.length - 1);
    }

    tsContent += '\n';

    fs.writeFile(tsFileName, tsContent, { encoding: 'utf-8' }, (error) => {
      if (error) {
        throw error;
      }
    });
  });
};

run();
