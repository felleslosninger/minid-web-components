import { customElement, property } from 'lit/decorators.js';
import { css, html } from 'lit';
import { MidIconName } from 'src/types/icon-name.ts';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { until } from 'lit/directives/until.js';
import { MinidElement } from 'mixins/tailwind.mixin.ts';

@customElement('mid-icon')
export class MinidIcon extends MinidElement {
  @property({ type: String })
  name!: MidIconName;

  /**
   * Accepts a css property like `100px` or `40rem`
   */
  @property({ type: String })
  size?: string;

  @property({ type: String })
  fill?: string;

  @property({ type: String })
  stroke?: string;

  connectedCallback() {
    super.connectedCallback();
    this._whenSettled();
  }

  private placeholderRef: Ref<HTMLElement> = createRef();
  async _whenSettled() {
    await this.updateComplete;
    if (this.size != null) {
      this.placeholderRef.value?.style.setProperty('width', this.size);
      this.placeholderRef.value?.style.setProperty('height', this.size);
    }
  }

  createSvgFromString(svgString: string): SVGElement {
    const div = document.createElement('div');
    div.innerHTML = svgString;

    return (
      div.querySelector('svg') ??
      document.createElementNS('http://www.w3.org/2000/svg', 'path')
    );
  }

  placeholder() {
    return html` <div ${ref(this.placeholderRef)}></div> `;
  }

  static override styles = [css`
    :host {
     display: inline-flex;
    },
    
  `,
    super.styles
  ];

  protected render() {
    const importedIcon = import(
      `../../src/assets/icons/${this.name}.svg?raw` // TODO: Fix path
    ).then((iconModule) => {
      const svgElement = this.createSvgFromString(iconModule.default);

      if (this.size) {
        svgElement.setAttribute('width', `${this.size}`);
        svgElement.setAttribute('height', `${this.size}`);
      }

      if (this.fill) {
        svgElement.setAttribute('fill', this.fill);
        svgElement.childNodes.forEach((node) => {
          if (node instanceof SVGElement) {
            node.removeAttribute('fill');
          }
        });
      }

      if (this.stroke) {
        svgElement.setAttribute('stroke', this.stroke);
        svgElement.childNodes.forEach((node) => {
          if (node instanceof SVGElement) {
            node.removeAttribute('stroke');
          }
        });
      }

      return html`${svgElement}`;
    });

    return until(importedIcon, this.placeholder());
  }
}
