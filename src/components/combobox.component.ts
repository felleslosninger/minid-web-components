import { css, html, LitElement } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import './popup.component';
import { styled } from '../mixins/tailwind.mixin.ts';
import { MinidPopup } from './popup.component';
import { waitForEvent } from '../internal/event';
import { watch } from '../internal/watch';
import {
  getAnimation,
  setDefaultAnimation,
} from '../utilities/animation-registry';
import { animateTo, stopAnimations } from '../internal/animate';
import { getTabbableBoundary } from '../internal/tabbable';
import { MinidButton } from './button.component';
import { MinidMenu } from '../components/menu.component';
import { MinidPhoneInput } from '../components/phone-input.component';
import { MinidTextfield } from '../components/textfield.component';
import { MinidMenuItem } from '../components/menu-item.component.ts';

declare global {
  interface HTMLElementTagNameMap {
    'mid-combobox': MinidCombobox;
  }
}

const styles = [
  css`
    :host {
      display: flex;
    }
  `,
];

/**
 * @slot -- Default slot for content of the dropdown panel
 * @slot trigger - Used for the button element that will be used to open the dropdown menu
 * @part panel - Select the dropdown panel host element
 */
@customElement('mid-combobox')
export class MinidCombobox extends styled(LitElement, styles) {
  private closeWatcher?: CloseWatcher;
  private triggerElement: 'mid-textfield' | 'mid-phone-input' = 'mid-textfield';

  @query('#combobox')
  private popup!: MinidPopup;

  @query('.combobox__trigger')
  private trigger!: HTMLSlotElement;

  @query('.combobox__panel')
  private panel!: HTMLSlotElement;

  @queryAssignedElements({ slot: 'trigger' })
  private triggerElements!: (
    | MinidTextfield
    | MinidPhoneInput
    | HTMLInputElement
  )[];

  /**
   * By default, the combobox is closed when an item is selected. This attribute will keep it open instead. Useful for
   * comboboxs that allow for multiple interactions.
   */
  @property({ type: Boolean, reflect: true })
  stayopenonselect = false;

  /**
   * Indicates wether the combobox panel is open. You can use this or the show/hide methods.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Distance between trigger and combobox panel
   */
  @property({ type: Number })
  distance = 4;

  /**
   * Nudge the combobox panel position. Accepts a negative or positive number.
   */
  @property({ type: Number })
  skidding = 0;

  /**
   * Choose if position is `fixed` or `absolute`. `absolute` is more performant,
   * but `fixed` can solve issues with overflow clipping
   */
  @property({ type: Boolean })
  hoist = false;

  @property({ type: Boolean })
  disabled = false;

  /**
   * The combobox will close when the user interacts outside of this element (e.g. clicking). Useful for composing other
   * components that use a combobox internally.
   */
  @property({ attribute: false })
  private containingElement?: HTMLElement;

  connectedCallback() {
    super.connectedCallback();

    if (!this.containingElement) {
      this.containingElement = this;
    }
  }

  firstUpdated() {
    const input = this.triggerElements[0];
    if (input.tagName.toLowerCase() === 'mid-phone-input') {
      this.triggerElement = 'mid-phone-input';
    } else if (input.tagName.toLowerCase() === 'mid-textfield') {
      this.triggerElement = 'mid-textfield';
    }

    this.panel.hidden = !this.open;

    const menu = this.getMenu();
    if (menu) {
      menu.variant = 'combobox';
    }

    // If the combobox panel is visible on init, update its position
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

  private handleCountryClick = () => {
    const menu = this.getMenu();

    this.open ? this.hide() : this.show();
    if (this.open && menu && menu.searchable) {
      // Delay focus slightly to win the focus battle
      setTimeout(() => {
        menu.clearFilter();
        menu.focusSearchField();
      }, 1);
    }
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    // Close when escape is pressed inside an open combobox. We need to listen on the panel itself and stop propagation
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

      // Tabbing within an open menu should close the combobox and refocus the trigger
      if (this.open && tabbedIsMenuItem) {
        event.preventDefault();
        this.hide();
        this.focusOnTrigger();
        return;
      }

      // Tabbing outside of the containing element closes the panel
      //
      // If the combobox is used within a shadow DOM, we need to obtain the activeElement within that shadowRoot,
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

  private handlePanelSelect = (event: CustomEvent) => {
    if (this.triggerElement !== 'mid-phone-input') {
      return;
    }

    // Transfer selected country from panel to input field
    const input = this.triggerElements[0] as MinidPhoneInput;
    const country = event.detail.item.value;
    input.country = country;

    const target = event.target as HTMLElement;

    // Hide the combobox when a menu item is selected
    if (!this.stayopenonselect && target.tagName.toLowerCase() === 'mid-menu') {
      this.hide();
      this.focusOnTrigger();
    }
  };

  handleTriggerClick() {
    if (this.triggerElement === 'mid-phone-input') {
      return;
    }

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
      if (this.triggerElement === 'mid-textfield') {
        this.handleTriggerClick();
      }
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

          // Wait for the combobox to open before focusing, but not the animation
          await this.updateComplete;
        }

        if (menuItems.length > 0) {
          // Focus on the first/last menu item after showing
          this.updateComplete.then(() => {
            if (event.key === 'ArrowDown' || event.key === 'Home') {
              menu.setCurrentItem(firstMenuItem);
              if (this.triggerElement === 'mid-textfield') {
                firstMenuItem.focus();
              } else {
                menu.clearFilter();
                menu.focusSearchField();
              }
            }

            if (event.key === 'ArrowUp' || event.key === 'End') {
              menu.setCurrentItem(lastMenuItem);
              if (this.triggerElement === 'mid-textfield') {
                lastMenuItem.focus();
              } else {
                menu.clearFilter();
                menu.focusSearchField();
              }
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

  //
  // Slotted triggers can be arbitrary content, but we need to link them to the combobox panel with `aria-haspopup` and
  // `aria-expanded`. These must be applied to the "accessible trigger" (the tabbable portion of the trigger element
  // that gets slotted in) so screen readers will understand them. The accessible trigger could be the slotted element,
  // a child of the slotted element, or an element in the slotted element's shadow root.
  //
  // For example, the accessible trigger of an <sl-button> is a <button> located inside its shadow root.
  //
  // To determine this, we assume the first tabbable element in the trigger slot is the "accessible trigger."
  //
  updateAccessibleTrigger() {
    const assignedElements = this.trigger.assignedElements({
      flatten: true,
    }) as HTMLElement[];
    const accessibleTrigger = assignedElements.find(
      (el) => getTabbableBoundary(el).start
    );
    let target: HTMLElement;

    if (accessibleTrigger) {
      switch (accessibleTrigger.tagName.toLowerCase()) {
        // buttons have to update the internal button so it's announced correctly by screen readers
        case 'mid-button':
          target = (accessibleTrigger as MinidButton).button;
          break;

        default:
          target = accessibleTrigger;
      }

      target.setAttribute('aria-haspopup', 'true');
      target.setAttribute('aria-expanded', this.open ? 'true' : 'false');
    }
  }

  /**
   * Shows the combobox panel.
   */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, 'mid-after-show');
  }

  /**
   * Hides the combobox panel
   */
  async hide() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, 'mid-after-hide');
  }

  /**
   * Instructs the combobox menu to reposition. Useful when the position or size of the trigger changes when the menu
   * is activated.
   */
  reposition() {
    this.popup.reposition();
  }

  addOpenListeners() {
    if ('CloseWatcher' in window) {
      this.closeWatcher?.destroy();
      this.closeWatcher = new CloseWatcher();
      this.closeWatcher.onclose = () => {
        this.hide();
        this.focusOnTrigger();
      };
    }

    document.addEventListener('keydown', this.handleDocumentKeyDown);
    document.addEventListener('mousedown', this.handleDocumentMouseDown);
  }

  removeOpenListeners() {
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
      const { keyframes, options } = getAnimation(this, 'combobox.show');
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
      const { keyframes, options } = getAnimation(this, 'combobox.hide');
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
        id="combobox"
        distance=${this.distance}
        placement="bottom-end"
        skidding=${this.skidding}
        strategy=${this.hoist ? 'fixed' : 'absolute'}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync="width"
        ?active=${this.open}
      >
        <slot
          class="combobox__trigger"
          slot="anchor"
          name="trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
          @slotchange=${this.handleTriggerSlotChange}
          @mid-country-click=${this.handleCountryClick}
        ></slot>
        <div
          class="bg-accent"
          aria-hidden=${this.open ? 'false' : 'true'}
          aria-labelledby="combobox"
        >
          <slot
            class="combobox__panel"
            part="panel"
            @keydown=${this.handleKeyDown}
            @mid-select=${this.handlePanelSelect}
          ></slot>
        </div>
      </mid-popup>
    `;
  }
}

setDefaultAnimation('combobox.show', {
  keyframes: [
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1 },
  ],
  options: { duration: 100, easing: 'ease' },
});

setDefaultAnimation('combobox.hide', {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.9 },
  ],
  options: { duration: 100, easing: 'ease' },
});
