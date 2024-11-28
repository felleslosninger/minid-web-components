import { LitElement } from 'lit';

export interface FormAssociatedMixinInterface {
  internals: ElementInternals;
  validity: ValidityState;
  validationMessage: string | undefined;

  userInvalid: boolean;

  setFormValue(value: string): void;
  setValidity(validity: ValidityState, message?: string, anchor?: HTMLElement): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
}

/**
 * @class
 * @ignore
 */
export const FormAssociatedMixin = <TBase extends Constructor<LitElement>>(Base: TBase): TBase & Constructor<FormAssociatedMixinInterface> => {
   class FormAssociated extends Base implements FormAssociatedMixinInterface {

    static formAssociated = true;
    internals: ElementInternals;
    validity: ValidityState;

    validationMessage: string | undefined;
    userInvalid = false;

    constructor(...args: any[]) {
      super(...args as ConstructorParameters<typeof Base>);

      this.addEventListener('invalid', (e) => {
        e.preventDefault();
        this.userInvalid = true;
        this.requestUpdate();
      });

      this.internals = this.attachInternals();
      this.validity = this.internals.validity;
      this.validationMessage = this.internals.validationMessage;
    }

    setFormValue(value: string) {
      this.internals.setFormValue(value);
    }

    setValidity(validity: ValidityState, message?: string, anchor?: HTMLElement) {
      this.validationMessage = message;
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