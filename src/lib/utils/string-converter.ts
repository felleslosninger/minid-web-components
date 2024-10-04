import { ComplexAttributeConverter } from 'lit';

export const stringConverter: ComplexAttributeConverter = {
  fromAttribute(value: string | null): string {
    return value ?? '';
  },
  toAttribute(value: string): string | null {
    return value || null;
  },
};
