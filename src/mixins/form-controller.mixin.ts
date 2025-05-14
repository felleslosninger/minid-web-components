import { LitElement } from 'lit';
import type { Constructor } from '../types/mixin-constructor';

export interface FormAssociatedMixinInterface {
  internals: ElementInternals;
  shadowRoot: ShadowRoot | null;
  setFormValue(
    value: File | string | FormData | null,
    state?: File | string | FormData | null
  ): void;
}

export const FormControllerMixin = <TBase extends Constructor<LitElement>>(
  Base: TBase
): TBase & Constructor<FormAssociatedMixinInterface> => {
  class FormAssociated extends Base implements FormAssociatedMixinInterface {
    static formAssociated = true;

    internals: ElementInternals;

    constructor(...args: any[]) {
      super(...(args as ConstructorParameters<typeof Base>));
      // @ts-expect-error missing some u
      this.internals = this.attachInternals();
    }

    setFormValue(
      value: File | string | FormData | null,
      state?: File | string | FormData | null
    ) {
      this.internals.setFormValue(value, state);
    }

    get shadowRoot() {
      return this.internals.shadowRoot;
    }
  }

  return FormAssociated as TBase & Constructor<FormAssociatedMixinInterface>;
};

export interface ConstraintsValidationMixinInterface
  extends FormAssociatedMixinInterface {
  validity: ValidityState;
  validationMessage: string | undefined;
  setValidity(
    validity: ValidityState,
    message?: string,
    anchor?: HTMLElement
  ): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
}

export const ConstraintsValidationMixin = <
  TBase extends Constructor<LitElement>,
>(
  Base: TBase
): TBase & Constructor<ConstraintsValidationMixinInterface> => {
  class ConstraintsValidation
    extends FormControllerMixin(Base)
    implements ConstraintsValidationMixinInterface
  {
    validity: ValidityState;
    validationMessage: string | undefined;

    constructor(...args: any[]) {
      super(...(args as ConstructorParameters<typeof Base>));
      this.validity = this.internals.validity;
      this.validationMessage = this.internals.validationMessage;
    }

    setValidity(
      validity: ValidityStateFlags,
      message?: string,
      anchor?: HTMLElement
    ) {
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

  return ConstraintsValidation as TBase &
    Constructor<ConstraintsValidationMixinInterface>;
};
