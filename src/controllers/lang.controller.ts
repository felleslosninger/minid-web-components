import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { getLang } from '../utilities/lang.js';

/**
 * Reactive controller that keeps a component in sync with the active language.
 */
export class LangController implements ReactiveController {
  private readonly host: ReactiveControllerHost & HTMLElement;
  private readonly observer: MutationObserver;
  private managed = false;

  constructor(host: ReactiveControllerHost & HTMLElement) {
    (this.host = host).addController(this);
    this.observer = new MutationObserver(() => this.handleDocumentLangChange());
  }

  hostConnected() {
    if (!this.host.hasAttribute('lang')) {
      this.host.setAttribute('lang', getLang(this.host));
      this.managed = true;
    }

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });
  }

  hostDisconnected() {
    this.observer.disconnect();
  }

  private handleDocumentLangChange() {
    if (this.managed) {
      this.host.removeAttribute('lang');
      this.host.setAttribute('lang', getLang(this.host));
    }
    this.host.requestUpdate();
  }
}
