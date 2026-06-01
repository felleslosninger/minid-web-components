import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { getLang } from '../utilities/lang.js';

/**
 * Reactive controller that keeps a component in sync with the active language.
 *
 * Responsibilities:
 * - Sets `lang` on the host element (light DOM) if the consumer hasn't already,
 *   so screen readers (VoiceOver) can detect the language without needing to
 *   traverse into shadow DOM.
 * - Watches `document.documentElement` for `lang` attribute changes (triggered
 *   by `changeLocale`) and calls `host.requestUpdate()` so the shadow DOM
 *   re-renders with the new language.
 */
export class LangController implements ReactiveController {
  private readonly host: ReactiveControllerHost & HTMLElement;
  private readonly observer: MutationObserver;
  /** True when we set the host's lang programmatically (not the consumer). */
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
      // Remove our previously set lang so getLang() walks up to the new
      // document lang rather than stopping at our stale value on the host.
      this.host.removeAttribute('lang');
      this.host.setAttribute('lang', getLang(this.host));
    }
    // Always re-render so shadow DOM elements pick up the new lang value.
    this.host.requestUpdate();
  }
}
