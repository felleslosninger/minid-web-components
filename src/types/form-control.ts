import { IElementInternals } from 'element-internals-polyfill';
import { FormValue } from './form-value';

/** Interface of exported FormControl behavior */
export interface FormControlInterface {
  validationTarget?: HTMLElement | null;
  readonly form: HTMLFormElement;
  readonly internals: ElementInternals & IElementInternals;
  readonly showError: boolean;
  readonly validationMessage: string;
  readonly validity: ValidityState;
  readonly validationComplete: Promise<void>;
  connectedCallback(): void;
  checkValidity(): boolean;
  formResetCallback(): void;
  resetFormControl?(): void;
  // validateAsync(validator: AsyncValidator): Promise<void>;
  valueChangedCallback?(value: FormValue): void | Promise<void>;
  validityCallback(validationKey: string): string | void;
  validationMessageCallback(message: string): void;
  setValue(value: FormValue): void;
  forceError(message?: string): void;
  shouldFormValueUpdate?(): boolean;
}
