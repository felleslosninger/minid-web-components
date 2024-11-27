import { LitElement } from 'lit';

export interface FormAssociatedMixinInterface {
  internals: ElementInternals;
  validity: ValidityState;
  validationMessage: string | undefined;

  setFormValue(value: string): void;

  setValidity(validity: ValidityState, message?: string, anchor?: HTMLElement): void;

  checkValidity(): boolean;

  reportValidity(): boolean;

  getValidationMessage(validity: ValidityState): string | null | undefined;

}

export const FormAssociatedMixin = <TBase extends Constructor<LitElement>>(Base: TBase): TBase & Constructor<FormAssociatedMixinInterface> => {
  class FormAssociated extends Base implements FormAssociatedMixinInterface {

    static formAssociated = true;
    internals: ElementInternals;
    validity: ValidityState;

    validationMessage: string | undefined;

    defaultValidationMessages: { [key: string]: string } = {
      valueMissing: 'This field is required.',
      typeMismatch: 'The value is not in the correct format.',
      tooShort: 'The value is too short.',
      tooLong: 'The value is too long.',
      rangeUnderflow: 'The value is too low.',
      rangeOverflow: 'The value is too high.',
      stepMismatch: 'The value is not in the correct increment.',
      patternMismatch: 'The value does not match the required pattern.',
      badInput: 'The input is invalid.',
      customError: 'The input is invalid.',
    };

    constructor(...args: any[]) {
      super(...args as ConstructorParameters<typeof Base>);

      this.internals = this.attachInternals();
      this.validity = this.internals.validity;
      this.validationMessage = this.internals.validationMessage;
    }

    setFormValue(value: string) {
      this.internals.setFormValue(value);
    }

    getValidationMessage(validity: ValidityState): string | undefined {
      if (!validity.valid) {
        const validityKeys = Object.keys(this.defaultValidationMessages) as (keyof ValidityState)[];
        for (const key of validityKeys) {
          if (validity[key] && this.defaultValidationMessages[key]) {
            return this.defaultValidationMessages[key];
          }
        }
      }
      return undefined;
    }

    setValidity(validity: ValidityState, message?: string, anchor?: HTMLElement) {
      this.validationMessage = message || this.getValidationMessage(validity);
      this.internals.setValidity(validity, this.validationMessage, anchor);
    }


    checkValidity(): boolean {
      return this.internals.checkValidity();
    }

    reportValidity(): boolean {
      return this.internals.reportValidity();
    }

  }

  return FormAssociated as TBase & Constructor<FormAssociatedMixinInterface>;
};


type Constructor<T = {}> = new (...args: any[]) => T;