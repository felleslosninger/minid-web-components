import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin.ts';
import './icon/icon.component.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-language-selector': MinidLanguageSelector;
  }
}

let nextUniqueId = 0;

const styles = [
  css`
    :host {
      display: inline-flex;
      position: relative;
    }
    button > mid-icon {
      font-size: 2rem;
    }
    .panel {
      position: absolute;
      inset: auto;
      inset-inline-end: 0;
      top: 100%;
      margin-block-start: 4px;
      z-index: 10;
      min-width: 10rem;
    }
    .panel li button {
      text-align: start;
    }
    .panel li button:hover,
    .panel li button:focus {
      background-color: var(--ds-color-neutral-surface-hover);
    }
  `,
];

@customElement('mid-language-selector')
export class MinidLanguageSelector extends styled(LitElement, styles) {
  private readonly _panelId = `mid-lang-${nextUniqueId++}`;

  @state() private _open = false;

  @property()
  locale: string = 'nb';

  @property({ type: Object })
  languages: Record<string, string> = {
    nb: 'Bokmål',
    nn: 'Nynorsk',
    en: 'English',
    se: 'Sámegiella',
  };

  private _handleDocumentMouseDown = (e: MouseEvent) => {
    if (!e.composedPath().includes(this)) {
      this._close();
    }
  };

  private _handleDocumentKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      this._close();
      this._triggerEl?.focus();
    }
  };

  @query('button')
  private _triggerEl?: HTMLButtonElement;

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeListeners();
  }

  private _addListeners() {
    document.addEventListener('mousedown', this._handleDocumentMouseDown, true);
    document.addEventListener('keydown', this._handleDocumentKeyDown, true);
  }

  private _removeListeners() {
    document.removeEventListener(
      'mousedown',
      this._handleDocumentMouseDown,
      true,
    );
    document.removeEventListener(
      'keydown',
      this._handleDocumentKeyDown,
      true,
    );
  }

  private _toggle() {
    if (this._open) {
      this._close();
    } else {
      this._open = true;
      this._addListeners();
    }
  }

  private _close() {
    this._open = false;
    this._removeListeners();
  }

  private _select(locale: string) {
    this.dispatchEvent(
      new CustomEvent('mid-language-change', {
        detail: { locale },
        bubbles: true,
        composed: true,
      }),
    );
    this._close();
    this._triggerEl?.focus();
  }

  override render() {
    return html`
      <button
        class="focus-visible:focus-ring flex h-fit min-h-12 cursor-pointer items-center gap-2 rounded border border-transparent bg-transparent px-4 py-2 font-medium text-accent-subtle hover:bg-accent-surface-hover hover:text-accent active:bg-accent-surface-active"
        aria-expanded=${this._open}
        aria-controls=${this._panelId}
        @click=${this._toggle}
      >
        <mid-icon name="language"></mid-icon>
        <span class="max-md:sr-only">Language</span>
        <mid-icon
          name="chevron-down"
          class="max-md:hidden"
          aria-hidden="true"
        ></mid-icon>
      </button>

      ${this._open
        ? html`
            <div
              id=${this._panelId}
              class="ds-dropdown panel"
              role="group"
              aria-label="Select language"
            >
              <ul>
                ${Object.entries(this.languages).map(
                  ([key, name]) => html`
                    <li>
                      <button
                        lang=${key}
                        aria-current=${key === this.locale ? 'true' : nothing}
                        @click=${() => this._select(key)}
                      >
                        ${name}
                      </button>
                    </li>
                  `,
                )}
              </ul>
            </div>
          `
        : nothing}
    `;
  }
}
