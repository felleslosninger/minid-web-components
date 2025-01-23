/** Generic type to allow usage of HTMLElement lifecycle methods */
export interface IControlHost {
  attributeChangedCallback?(
    name: string,
    oldValue: string,
    newValue: string
  ): void;
  connectedCallback?(): void;
  disconnectedCallback?(): void;
  checked?: boolean;
  disabled?: boolean;
}
