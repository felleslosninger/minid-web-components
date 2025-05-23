import { LitElement } from 'lit';
import type { IControlHost } from '../types/control-host';
import type { FormControlInterface } from '../types/form-control';
import type { FormValue } from '../types/form-value';
import type { Constructor } from '../types/mixin-constructor';
import type {
  CustomValidityState,
  validationMessageCallback,
  Validator,
} from '../types/validator.type';

/**
 *
 * https://github.com/open-wc/form-participation/tree/main/packages/form-control
 */
export function FormControlMixin<
  TBase extends Constructor<LitElement & IControlHost> & {
    observedAttributes?: string[];
  },
>(SuperClass: TBase) {
  class FormControl extends SuperClass {
    /**
     * Wires up control instances to be form associated
     * @ignore
     */
    static get formAssociated(): boolean {
      return true;
    }

    /**
     * A list of Validator objects that will be evaluated when a control's form
     * value is modified or optionally when a given attribute changes.
     *
     * When a Validator's callback returns false, the entire form control will
     * be set to an invalid state.
     * @ignore
     */
    declare static formControlValidators: Validator[];

    /**
     * If set to true the control described should be evaluated and validated
     * as part of a group. Like a radio, if any member of the group's validity
     * changes the the other members should update as well.
     * @ignore
     */
    declare static formControlValidationGroup: boolean;

    /**
     * @ignore
     */
    private static get validators(): Validator[] {
      return this.formControlValidators || [];
    }

    /**
     * Allows the FormControl instance to respond to Validator attributes.
     * For instance, if a given Validator has a `required` attribute, that
     * validator will be evaluated whenever the host's required attribute
     * is updated.
     * @ignore
     */
    static get observedAttributes(): string[] {
      const validatorAttributes = this.validators
        .map((validator) => validator.attribute)
        .flat();

      const observedAttributes = super.observedAttributes || [];

      /** Make sure there are no duplicates inside the attributes list */
      const attributeSet = new Set([
        ...observedAttributes,
        ...validatorAttributes,
      ]);
      return [...attributeSet] as string[];
    }

    /**
     * Return the validator associated with a given attribute. If no
     * Validator is associated with the attribute, it will return null.
     * @ignore
     */
    static getValidator(attribute: string): Validator | null {
      return (
        this.validators.find(
          (validator) => validator.attribute === attribute
        ) || null
      );
    }

    /**
     * Get all validators that are set to react to a given attribute
     * @param {string} attribute - The attribute that has changed
     * @returns {Validator[]}
     * @ignore
     */
    static getValidators(attribute: string): Validator[] | null {
      return this.validators.filter((validator) => {
        if (
          validator.attribute === attribute ||
          validator.attribute?.includes(attribute)
        ) {
          return true;
        }
      });
    }

    /**
     * The ElementInternals instance for the control.
     * @ignore
     */
    internals = this.attachInternals();

    /**
     * Keep track of if the control has focus
     * @private
     * @ignore
     */
    #focused = false;

    /**
     * Exists to control when an error should be displayed
     * @private
     * @ignore
     */
    #forceError = false;

    /**
     * Toggles to true whenever the element has been focused. This property
     * will reset whenever the control's formResetCallback is called.
     * @private
     * @ignore
     */
    #touched = false;

    /**
     * An internal abort controller for cancelling pending async validation
     * @ignore
     */
    #abortController?: AbortController;

    /**
     * Used for tracking if a validation target has been set to manage focus
     * when the control's validity is reported
     * @ignore
     */
    #awaitingValidationTarget = true;

    /**
     * Acts as a cache for the current value so the value can be re-evaluated
     * whenever an attribute changes or on some other event.
     * @ignore
     */
    #value: FormValue = '';

    /**
     * Set this[touched] and this[focused]
     * to true when the element is focused
     * @private
     * @ignore
     */
    #onFocus = (): void => {
      this.#touched = true;
      this.#focused = true;
      this.#shouldShowError();
    };

    /**
     * Reset this[focused] on blur
     * @private
     * @ignore
     */
    #onBlur = (): void => {
      this.#focused = false;

      this.#runValidators(this.shouldFormValueUpdate() ? this.#value : '');

      /**
       * Set forceError to ensure error messages persist until
       * the value is changed.
       */
      if (!this.validity.valid && this.#touched) {
        this.#forceError = true;
      }
      const showError = this.#shouldShowError();

      if (this.validationMessageCallback) {
        this.validationMessageCallback(showError ? this.validationMessage : '');
      }
      this.#dispatchInvalidEvent(showError);
    };

    /**
     * For the show error state on invalid
     * @private
     * @ignore
     */
    #onInvalid = (event?: Event): void => {
      event?.preventDefault();
      event?.stopImmediatePropagation();

      if (this.#awaitingValidationTarget && this.validationTarget) {
        this.internals.setValidity(
          this.validity,
          this.validationMessage,
          this.validationTarget
        );
        this.#awaitingValidationTarget = false;
      }
      this.#touched = true;
      this.#forceError = true;
      const showError = this.#shouldShowError();
      this?.validationMessageCallback?.(
        showError ? this.validationMessage : ''
      );
      this.#dispatchInvalidEvent(showError);
    };

    /**
     * Return a reference to the control's form
     * @ignore
     */
    get form(): HTMLFormElement {
      return this.internals.form as HTMLFormElement;
    }

    /**
     * Will return true if it is recommended that the control shows an internal
     * error. If using this property, it is wise to listen for 'invalid' events
     * on the element host and call preventDefault on the event. Doing this will
     * prevent browsers from showing a validation popup.
     * @ignore
     */
    get showError(): boolean {
      return this.#shouldShowError();
    }

    /**
     * Forward the internals checkValidity method
     * will return the valid state of the control.
     * @ignore
     */
    checkValidity(): boolean {
      return this.internals.checkValidity();
    }

    /**
     * The element's validity state
     * @ignore
     */
    get validity(): ValidityState {
      return this.internals.validity;
    }

    /**
     * The validation message shown by a given Validator object. If the control
     * is in a valid state this should be falsy.
     * @ignore
     */
    get validationMessage(): string {
      return this.internals.validationMessage;
    }

    constructor(...args: any[]) {
      super(...args);
      this.addEventListener?.('focus', this.#onFocus);
      this.addEventListener?.('blur', this.#onBlur);
      this.addEventListener?.('invalid', this.#onInvalid);
      this.setValue(null);
    }

    attributeChangedCallback(
      name: string,
      oldValue: string,
      newValue: string
    ): void {
      super.attributeChangedCallback?.(name, oldValue, newValue);

      /**
       * Check to see if a Validator is associated with the changed attribute.
       * If one exists, call control's validate function which will perform
       * control validation.
       * @ignore
       */
      const proto = this.constructor as typeof FormControl;
      const validators = proto.getValidators(name);

      if (validators?.length && this.validationTarget) {
        this.setValue(this.#value);
      }
    }

    /** PUBLIC LIFECYCLE METHODS */

    /**
     * Sets the control's form value if the call to `shouldFormValueUpdate`
     * returns `true`.
     * @param value {FormValue} - The value to pass to the form
     * @ignore
     */
    setValue(value: FormValue): void {
      this.#forceError = false;
      this.validationMessageCallback?.('');
      this.#value = value;
      const valueShouldUpdate = this.shouldFormValueUpdate();
      const valueToUpdate = valueShouldUpdate ? value : null;
      this.internals.setFormValue(valueToUpdate as string);
      this.#runValidators(valueToUpdate);
      if (this.valueChangedCallback) {
        this.valueChangedCallback(valueToUpdate);
      }
      const showError = this.#shouldShowError();
      this.#dispatchInvalidEvent(showError);
    }

    /**
     * Forces the control to show an error state. If a message is passed in,
     * it will be set as the control's internal validity state message.
     * @param message { string | undefined } - The message for internals validity state
     */
    forceError(message?: string) {
      if (message) {
        this.#setValidityWithOptionalTarget({ customError: true }, message);
      }
      this.#forceError = true;
      this.#shouldShowError();
    }

    /**
     * This method can be overridden to determine if the control's form value
     * should be set on a call to `setValue`. An example of when a user might want
     * to skip this step is when implementing checkbox-like behavior, first checking
     * to see if `this.checked` is set to a truthy value. By default this returns
     * `true`.
     * @ignore
     */
    shouldFormValueUpdate(): boolean {
      return true;
    }

    /**
     * Save a reference to the validation complete resolver
     * @ignore
     */
    #validationCompleteResolver?: (value: void | PromiseLike<void>) => void;

    /**
     * When true validation will be pending
     * @ignore
     */
    #isValidationPending = false;

    /**
     * @ignore
     */
    #validationComplete = Promise.resolve();

    /**
     * A promise that will resolve when all pending validations are complete
     * @ignore
     */
    get validationComplete(): Promise<void> {
      return new Promise((resolve) => resolve(this.#validationComplete));
    }

    /** DECLARED INSTANCE METHODS AND PROPERTIES*/

    /**
     * Resets a form control to its initial state
     * @ignore
     */
    declare resetFormControl: () => void;

    /**
     * This method is used to override the controls' validity message
     * for a given Validator key. This has the highest level of priority when
     * setting a validationMessage, so use this method wisely.
     *
     * The returned value will be used as the validationMessage for the given key.
     * @param validationKey {string} - The key that has returned invalid
     * @ignore
     */
    declare validityCallback: (validationKey: string) => string | void;

    /**
     * Called when the control's validationMessage should be changed
     * @param message { string } - The new validation message
     * @ignore
     */
    declare validationMessageCallback: (message: string) => void;

    /**
     * A callback for when the controls' form value changes. The value
     * passed to this function should not be confused with the control's
     * value property, this is the value that will appear on the form.
     *
     * In cases where `checked` did not exist on the control's prototype
     * upon initialization, this value and the value property will be identical;
     * in cases where `checked` is present upon initialization, this will be
     * effectively `this.checked && this.value`.
     * @ignore
     */
    declare valueChangedCallback: (value: FormValue) => void;

    /**
     * The element that will receive focus when the control's validity
     * state is reported either by a form submission or via API
     *
     * We use declare since this is optional and we don't particularly
     * care how the consuming component implements this (as a field, member
     * or getter/setter)
     * @ignore
     */
    declare validationTarget: HTMLElement | null;

    /** PRIVATE LIFECYCLE METHODS */

    /**
     * Check to see if an error should be shown. This method will also
     * update the internals state object with the --show-error state
     * if necessary.
     * @private
     * @ignore
     */
    #shouldShowError(): boolean {
      if (this.hasAttribute('disabled')) {
        return false;
      }

      const showError =
        this.#forceError ||
        (this.#touched && !this.validity.valid && !this.#focused);

      if (showError && this.internals.states) {
        this.internals.states.add('--show-error');
        this.internals.states.add('--invalid');
      } else if (this.internals.states) {
        this.internals.states.delete('--show-error');
        this.internals.states.delete('--invalid');
      }

      return showError;
    }

    #runValidators(value: FormValue): void {
      const proto = this.constructor as typeof FormControl;
      const validity: CustomValidityState = {};
      const validators = proto.validators;
      const asyncValidators: Promise<boolean | void>[] = [];
      const hasAsyncValidators = validators.some(
        (validator) => validator.isValid instanceof Promise
      );

      if (!this.#isValidationPending) {
        this.#validationComplete = new Promise((resolve) => {
          this.#validationCompleteResolver = resolve;
        });
        this.#isValidationPending = true;
      }

      /**
       * If an abort controller exists from a previous validation step
       * notify still-running async validators that we are requesting they
       * discontinue any work.
       */
      if (this.#abortController) {
        this.#abortController.abort();
      }

      /**
       * Create a new abort controller and replace the instance reference
       * so we can clean it up for next time
       */
      const abortController = new AbortController();
      this.#abortController = abortController;
      let validationMessage: string | undefined = undefined;

      /** Track to see if any validity key has changed */
      let hasChange = false;

      if (!validators.length) {
        return;
      }

      validators.forEach((validator) => {
        const key = validator.key || 'customError';
        const isValid = validator.isValid(this, value, abortController.signal);
        const isAsyncValidator = isValid instanceof Promise;

        if (isAsyncValidator) {
          asyncValidators.push(isValid);

          isValid.then((isValidatorValid) => {
            if (isValidatorValid === undefined || isValidatorValid === null) {
              return;
            }
            /** Invert the validity state to correspond to the ValidityState API */
            validity[key] = !isValidatorValid;

            validationMessage = this.#getValidatorMessageForValue(
              validator,
              value
            );
            this.#setValidityWithOptionalTarget(validity, validationMessage);
          });
        } else {
          /** Invert the validity state to correspond to the ValidityState API */
          validity[key] = !isValid;

          if (this.validity[key] !== !isValid) {
            hasChange = true;
          }

          // only update the validationMessage for the first invalid scenario
          // so that earlier invalid validators dont get their messages overwritten by later ones
          // in the validators array
          if (!isValid && !validationMessage) {
            validationMessage = this.#getValidatorMessageForValue(
              validator,
              value
            );
          }
        }
      });

      /** Once all the async validators have settled, resolve validationComplete */
      Promise.allSettled(asyncValidators).then(() => {
        /** Don't resolve validations if the signal is aborted */
        if (!abortController?.signal.aborted) {
          this.#isValidationPending = false;
          this.#validationCompleteResolver?.();
        }
      });

      /**
       * If async validators are present:
       * Only run updates when a sync validator has a change. This is to prevent
       * situations where running sync validators can override async validators
       * that are still in progress
       *
       * If async validators are not present, always update validity
       */
      if (hasChange || !hasAsyncValidators) {
        this.#setValidityWithOptionalTarget(validity, validationMessage);
      }
    }

    /**
     * If the validationTarget is not set, the user can decide how they would
     * prefer to handle focus when the field is validated.
     * @ignore
     */
    #setValidityWithOptionalTarget(
      validity: Partial<ValidityState>,
      validationMessage: string | undefined
    ): void {
      if (this.validationTarget) {
        this.internals.setValidity(
          validity,
          validationMessage,
          this.validationTarget
        );
        this.#awaitingValidationTarget = false;
      } else {
        this.internals.setValidity(validity, validationMessage);

        if (this.internals.validity.valid) {
          return;
        }

        /**
         * Sets mark the component as awaiting a validation target
         * if the element dispatches an invalid event, the #onInvalid listener
         * will check to see if the validation target has been set since this call
         * has run. This useful in cases like Lit's use of the query
         * decorator for setting the validationTarget or any scenario
         * where the validationTarget isn't available upon construction
         */
        this.#awaitingValidationTarget = true;
      }
    }

    /**
     * Process the validator message attribute
     * @ignore
     */
    #getValidatorMessageForValue(
      validator: Validator,
      value: FormValue
    ): string {
      /** If the validity callback exists and returns, use that as the result */

      if (this.validityCallback) {
        const message = this.validityCallback(validator.key || 'customError');

        if (message) {
          return message;
        }
      }

      if (validator.message instanceof Function) {
        return (validator.message as validationMessageCallback)(this, value);
      } else {
        return validator.message as string;
      }
    }

    /**
     * Reset control state when the form is reset
     */
    formResetCallback() {
      this.#touched = false;
      this.#forceError = false;
      this.#shouldShowError();
      this.resetFormControl?.();
      const showError = this.#shouldShowError();
      this.validationMessageCallback?.(showError ? this.validationMessage : '');
      this.#dispatchInvalidEvent(showError);
    }

    #dispatchInvalidEvent(showError: boolean) {
      const event = showError ? 'mid-invalid-show' : 'mid-invalid-hide';
      this.dispatchEvent(
        new CustomEvent(event, {
          bubbles: true,
          composed: true,
          detail: {
            validity: this.validity,
          },
        })
      );
    }
  }

  return FormControl as unknown as Constructor<FormControlInterface> & TBase;
}
