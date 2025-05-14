import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { styled } from '../mixins/tailwind.mixin.ts';
import './popup.component';
import {
  getAnimation,
  setDefaultAnimation,
} from '../utilities/animation-registry.ts';
import { waitForEvent } from '../internal/event.ts';
import { MinidPopup } from './popup.component';
import { watch } from '../internal/watch.ts';
import { animateTo, stopAnimations } from '../internal/animate.ts';
import { getTabbableBoundary } from '../internal/tabbable.ts';
import { MinidButton } from '../components/button.component.ts';
import type { MidSelectEvent } from '../events/mid-select.ts';
import { MinidMenu } from '../components/menu.component.ts';
import { MinidMenuItem } from 'src/components/menu-item.component.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-dropdown': MinidDropdown;
  }
}

let nextUniqueId = 0;

const styles = [
  css`
    :host {
      display: inline-flex;
    }
  `,
];

/**
 * @slot -- Default slot for content of the dropdown panel
 * @slot trigger - Used for the button element that will be used to open the dropdown menu
 * @part panel - Select the dropdown panel host element
 */
@customElement('mid-dropdown')
export class MinidDropdown extends styled(LitElement, styles) {
  private readonly popupId = `mid-dropdown-${nextUniqueId++}`;
  private closeWatcher?: CloseWatcher | null;

  @query('.popup')
  popup!: MinidPopup;

  @query('.trigger')
  trigger!: HTMLSlotElement;

  @query('.panel')
  panel!: HTMLSlotElement;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * By default, the dropdown is closed when an item is selected. This attribute will keep it open instead. Useful for
   * dropdowns that allow for multiple interactions.
   */
  @property({ type: Boolean, reflect: true })
  stayopenonselect = false;

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  @property({ reflect: true })
  placement:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end' = 'bottom-end';

  /**
   * Sync the dropdown panel size with the trigger element
   */
  @property({ reflect: true })
  sync?: 'width' | 'height' | 'both';

  /**
   * Distance between trigger and dropdown panel
   */
  @property({ type: Number })
  distance = 4;

  /**
   * Nudge the dropdown panel position. Accepts a negative or positive number.
   */
  @property({ type: Number })
  skidding = 0;

  @property({ type: Boolean })
  arrow = false;

  /**
   * Choose if position is `fixed` or `absolute`. `absolute` is more performant,
   * but `fixed` can solve issues with overflow clipping
   */
  @property({ type: Boolean })
  hoist = false;

  /**
   * The dropdown will close when the user interacts outside of this element (e.g. clicking). Useful for composing other
   * components that use a dropdown internally.
   */
  @property({ attribute: false })
  containingElement?: HTMLElement;

  connectedCallback() {
    super.connectedCallback();

    if (!this.containingElement) {
      this.containingElement = this;
    }
  }

  firstUpdated() {
    this.panel.hidden = !this.open;

    // If the dropdown is visible on init, update its position
    if (this.open) {
      this.addOpenListeners();
      this.popup.active = true;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeOpenListeners();
    this.hide();
  }

  focusOnTrigger() {
    const trigger = this.trigger.assignedElements({ flatten: true })[0] as
      | HTMLElement
      | undefined;
    if (typeof trigger?.focus === 'function') {
      trigger.focus();
    }
  }

  getMenu() {
    return this.panel
      .assignedElements({ flatten: true })
      .find((el) => el.tagName.toLowerCase() === 'mid-menu') as
      | MinidMenu
      | undefined;
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    // Close when escape is pressed inside an open dropdown. We need to listen on the panel itself and stop propagation
    // in case any ancestors are also listening for this key.
    if (this.open && event.key === 'Escape') {
      event.stopPropagation();
      this.hide();
      this.focusOnTrigger();
    }
  };

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    // Close when escape or tab is pressed
    if (event.key === 'Escape' && this.open && !this.closeWatcher) {
      event.stopPropagation();
      this.focusOnTrigger();
      this.hide();
      return;
    }

    // Handle tabbing
    if (event.key === 'Tab') {
      const composedPath = event.composedPath();
      const tabbedIsMenuItem = composedPath.some(
        (e): e is MinidMenuItem =>
          (e as HTMLElement).tagName?.toLowerCase() === 'mid-menu-item'
      );

      // Tabbing within an open menu should close the dropdown and refocus the trigger
      if (this.open && tabbedIsMenuItem) {
        event.preventDefault();
        this.hide();
        this.focusOnTrigger();
        return;
      }

      // Tabbing outside of the containing element closes the panel
      //
      // If the dropdown is used within a shadow DOM, we need to obtain the activeElement within that shadowRoot,
      // otherwise `document.activeElement` will only return the name of the parent shadow DOM element.
      setTimeout(() => {
        if (composedPath.every((target) => target !== this.containingElement)) {
          this.hide();
        }
      });
    }
  };

  private handleDocumentMouseDown = (event: MouseEvent) => {
    // Close when clicking outside of the containing element
    const path = event.composedPath();

    if (this.containingElement && !path.includes(this.containingElement)) {
      this.hide();
    }
  };

  private handlePanelSelect = (event: MidSelectEvent) => {
    const target = event.target as HTMLElement;

    // Hide the dropdown when a menu item is selected
    if (!this.stayopenonselect && target.tagName.toLowerCase() === 'mid-menu') {
      this.hide();
      this.focusOnTrigger();
    }
  };

  handleTriggerClick() {
    if (this.open) {
      this.hide();
    } else {
      this.show();
      this.focusOnTrigger();
    }
  }

  async handleTriggerKeyDown(event: KeyboardEvent) {
    // When spacebar/enter is pressed, show the panel but don't focus on the menu. This let's the user press the same
    // key again to hide the menu in case they don't want to make a selection.
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault();
      this.handleTriggerClick();
      return;
    }

    const menu = this.getMenu();

    if (menu) {
      const menuItems = menu.getAllSelectableItems();
      const firstMenuItem = menuItems[0];
      const lastMenuItem = menuItems[menuItems.length - 1];

      // When up/down is pressed, we make the assumption that the user is familiar with the menu and plans to make a
      // selection. Rather than toggle the panel, we focus on the menu (if one exists) and activate the first item for
      // faster navigation.
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();

        // Show the menu if it's not already open
        if (!this.open) {
          this.show();

          // Wait for the dropdown to open before focusing, but not the animation
          await this.updateComplete;
        }

        if (menuItems.length > 0) {
          // Focus on the first/last menu item after showing
          this.updateComplete.then(() => {
            if (event.key === 'ArrowDown' || event.key === 'Home') {
              menu.setCurrentItem(firstMenuItem);
              firstMenuItem.focus();
            }

            if (event.key === 'ArrowUp' || event.key === 'End') {
              menu.setCurrentItem(lastMenuItem);
              lastMenuItem.focus();
            }
          });
        }
      }
    }
  }

  handleTriggerKeyUp(event: KeyboardEvent) {
    // Prevent space from triggering a click event in Firefox
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  handleTriggerSlotChange() {
    this.updateAccessibleTrigger();
  }

  updateAccessibleTrigger() {
    const assignedElements = this.trigger.assignedElements({
      flatten: true,
    }) as HTMLElement[];
    const accessibleTrigger = assignedElements.find(
      (el) => getTabbableBoundary(el).start
    );
    let target: HTMLElement;
    if (accessibleTrigger) {
      if (accessibleTrigger.tagName.toLowerCase() === 'mid-button') {
        target = (accessibleTrigger as MinidButton).button;
      } else {
        target = accessibleTrigger;
      }

      target.setAttribute('aria-haspopup', 'true');
      target.setAttribute('aria-expanded', this.open ? 'true' : 'false');
    }
  }

  /**
   * Shows the dropdown panel.
   */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, 'mid-after-show');
  }

  /**
   * Hides the dropdown panel
   */
  async hide() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, 'mid-after-hide');
  }

  /**
   * Instructs the dropdown menu to reposition. Useful when the position or size of the trigger changes when the menu
   * is activated.
   */
  reposition() {
    this.popup.reposition();
  }

  addOpenListeners() {
    this.panel.addEventListener('mid-select', this.handlePanelSelect);
    if ('CloseWatcher' in window) {
      this.closeWatcher?.destroy();
      this.closeWatcher = new CloseWatcher();
      this.closeWatcher.onclose = () => {
        this.hide();
        this.focusOnTrigger();
      };
    } else {
      this.panel.addEventListener('keydown', this.handleKeyDown);
    }
    document.addEventListener('keydown', this.handleDocumentKeyDown);
    document.addEventListener('mousedown', this.handleDocumentMouseDown);
  }

  removeOpenListeners() {
    if (this.panel) {
      this.panel.removeEventListener('mid-select', this.handlePanelSelect);
      this.panel.removeEventListener('keydown', this.handleKeyDown);
    }
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    document.removeEventListener('mousedown', this.handleDocumentMouseDown);
    this.closeWatcher?.destroy();
  }

  @watch('open', { waitUntilFirstUpdate: true })
  async handleOpenChange() {
    if (this.disabled) {
      this.open = false;
      return;
    }

    this.updateAccessibleTrigger();

    if (this.open) {
      // Show
      this.dispatchEvent(
        new Event('mid-show', { bubbles: true, composed: true })
      );
      this.addOpenListeners();

      await stopAnimations(this);
      this.panel.hidden = false;
      this.popup.active = true;
      const { keyframes, options } = getAnimation(this, 'dropdown.show');
      await animateTo(this.popup.popup, keyframes, options);

      this.dispatchEvent(
        new Event('mid-after-show', { bubbles: true, composed: true })
      );
    } else {
      // Hide
      this.dispatchEvent(
        new Event('mid-hide', { bubbles: true, composed: true })
      );
      this.removeOpenListeners();

      await stopAnimations(this);
      const { keyframes, options } = getAnimation(this, 'dropdown.hide');
      await animateTo(this.popup.popup, keyframes, options);
      this.panel.hidden = true;
      this.popup.active = false;

      this.dispatchEvent(
        new Event('mid-after-hide', { bubbles: true, composed: true })
      );
    }
  }

  override render() {
    return html`
      <mid-popup
        id="${this.popupId}"
        class="${classMap({
          'text-body-sm': this.size === 'sm',
          'text-body-md': this.size === 'md',
          'text-body-lg': this.size === 'lg',
        })} popup [--arrow-border-color:var(--border-color-neutral-subtle)] [--arrow-size:8px]"
        distance=${this.distance}
        placement="${this.placement}"
        skidding=${this.skidding}
        strategy=${this.hoist ? 'fixed' : 'absolute'}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync=${ifDefined(this.sync)}
        ?arrow=${this.arrow}
      >
        <slot
          class="trigger"
          slot="anchor"
          name="trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
          @slotchange=${this.handleTriggerSlotChange}
        >
        </slot>
        <div
          class="bg-accent min-w-68"
          aria-hidden=${this.open ? 'false' : 'true'}
          aria-labelledby="${this.popupId}"
        >
          <slot part="panel" class="panel"></slot>
        </div>
      </mid-popup>
    `;
  }
}

setDefaultAnimation('dropdown.show', {
  keyframes: [
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1 },
  ],
  options: { duration: 100, easing: 'ease' },
});

setDefaultAnimation('dropdown.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.9 },
  ],
  options: { duration: 100, easing: 'ease' },
});
