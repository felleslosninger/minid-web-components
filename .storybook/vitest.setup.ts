import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/web-components-vite';
import * as previewAnnotations from './preview';

const annotations = setProjectAnnotations([previewAnnotations]);

// Run Storybook's beforeAll hook
beforeAll(annotations.beforeAll);
