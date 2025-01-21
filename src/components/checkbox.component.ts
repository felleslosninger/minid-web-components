import { html, LitElement } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedNodes,
} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from '../mixins/tailwind.mixin';
import { FormControllerMixin } from '../mixins/form-controller.mixin.ts';

@customElement('mid-checkbox')
export class MinidCheckbox extends FormControllerMixin(styled(LitElement)) {
  @property({ type: Boolean })
  checked = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  readonly = false;

  @property({ type: String })
  size: 'sm' | 'md' | 'lg' = 'md';

  @query('.fds-checkbox__description')
  checkboxDescriptionElement!: HTMLDivElement;

  @queryAssignedNodes({ slot: 'description', flatten: true })
  descriptionNodes?: NodeListOf<HTMLElement>;

  #handleChange(event: Event) {
    this.checked = (event.target as HTMLInputElement).checked;
    if (this.checked) {
      this.setFormValue('on', 'checked');
    } else {
      this.setFormValue(null);
    }
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  #handleClick(event: Event) {
    if (this.readonly) {
      event.preventDefault();
    }
  }

  #updateDescriptionHidden() {
    this.checkboxDescriptionElement.style.display = !this.descriptionNodes
      ?.length
      ? 'none'
      : 'block';
  }

  protected firstUpdated() {
    this.#updateDescriptionHidden();
  }

  override render() {
    const sm = this.size === 'sm';
    const md = this.size === 'md';
    const lg = this.size === 'lg';

    return html`
      <div
        class="${classMap({
          'fds-checkbox': true,
          'fds-paragraph': true,
          'fds-checkbox--readonly': this.readonly,
          'fds-paragraph--sm': sm,
          'fds-checkbox--sm': sm,
          'fds-paragraph--md': md,
          'fds-checkbox--md': md,
          'fds-paragraph--lg': lg,
          'fds-checkbox--lg': lg,
        })}"
      >
        <input
          id="checkbox"
          class="fds-checkbox__input"
          type="checkbox"
          @change=${this.#handleChange}
          @click=${this.#handleClick}
          ?disabled=${this.disabled}
          ?checked=${this.checked}
          ?readonly=${this.readonly}
        />
        <label
          for="checkbox"
          class=${classMap({
            'fds-label': true,
            'fds-checkbox__label': true,
            'fds-label--regular-weight': true,
            'fds-label--sm': sm,
            'fds-label--md': md,
            'fds-label--lg': lg,
          })}
        >
          <slot></slot>
        </label>
        <div
          class="${classMap({
            'fds-paragraph': true,
            'fds-checkbox__description': true,
            'fds-paragraph--sm': sm,
            'fds-paragraph--md': md,
            'fds-paragraph--lg': lg,
          })}"
        >
          <slot
            name="description"
            @slotchange=${this.#updateDescriptionHidden}
          ></slot>
        </div>
      </div>
    `;
  }
}
