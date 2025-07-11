import type { FormControlInterface } from '../types/form-control';
import type { FormValue } from '../types/form-value';
import type { Validator } from '../types/validator.type';

export const requiredValidator: Validator = {
  attribute: 'required',
  key: 'valueMissing',
  message: 'Please fill out this field',
  isValid(
    instance: HTMLElement & { required: boolean },
    value: FormValue
  ): boolean {
    let valid = true;

    if ((instance.hasAttribute('required') || instance.required) && !value) {
      valid = false;
    }

    return valid;
  },
};

export const minLengthValidator: Validator = {
  attribute: 'minlength',
  key: 'tooShort',
  message(
    instance: FormControlInterface & { minlength: number },
    value: FormValue
  ): string {
    const _value = (value as string) || '';
    return `Please use at least ${instance.minlength} characters (you are currently using ${_value.length} characters).`;
  },
  isValid(
    instance: HTMLElement & { minlength: number },
    value: string
  ): boolean {
    /** If no value is provided, this validator should return true */
    if (!value) {
      return true;
    }

    if (!!value && instance.minlength > value.length) {
      return false;
    }

    return true;
  },
};

export const maxLengthValidator: Validator = {
  attribute: 'maxlength',
  key: 'tooLong',
  message(
    instance: FormControlInterface & { maxLength: number },
    value: FormValue
  ): string {
    const _value = (value as string) || '';
    return `Please use no more than ${instance.maxLength} characters (you are currently using ${_value.length} characters).`;
  },
  isValid(
    instance: HTMLElement & { maxLength: number },
    value: string
  ): boolean {
    /** If maxLength isn't set, this is valid */
    if (!instance.maxLength) {
      return true;
    }

    if (!!value && instance.maxLength < value.length) {
      return false;
    }

    return true;
  },
};

export const patternValidator: Validator = {
  attribute: 'pattern',
  key: 'patternMismatch',
  message: 'Please match the requested format',
  isValid(instance: HTMLElement & { pattern: string }, value: string): boolean {
    /** If no value is provided, this validator should return true */
    if (!value || !instance.pattern) {
      return true;
    }

    const regExp = new RegExp(instance.pattern);
    return !!regExp.exec(value);
  },
};
