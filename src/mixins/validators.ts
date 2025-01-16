import { FormValue } from 'src/types/form-value';
import { Validator } from 'src/types/validator.type';

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
