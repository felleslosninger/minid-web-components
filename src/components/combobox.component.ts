import { css, html, LitElement, PropertyValues } from 'lit';
import {
  customElement,
  property,
  query,
  queryAssignedElements,
} from 'lit/decorators.js';
import 'components/popup.component';
import { styled } from 'mixins/tailwind.mixin.ts';
import { MinidPopup } from 'components/popup.component';
import { waitForEvent } from 'src/internal/event';
import { watch } from 'src/internal/watch';
import {
  getAnimation,
  setDefaultAnimation,
} from 'src/components/utilities/animation-registry';
import { animateTo, stopAnimations } from 'src/internal/animate';
import { getTabbableBoundary } from 'src/internal/tabbable';
import { MinidButton } from 'src/components/button.component';
import { MinidMenu } from 'src/components/menu.component';
import { MinidSearch } from 'src/components/search.component';

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
  #closeWatcher?: CloseWatcher;

  @query('#dropdown')
  popup!: MinidPopup;

  @query('.dropdown__trigger')
  trigger!: HTMLSlotElement;

  @query('.dropdown__panel')
  panel!: HTMLSlotElement;

  @queryAssignedElements({ slot: 'trigger' })
  triggerElements!: HTMLInputElement[];

  /**
   * By default, the dropdown is closed when an item is selected. This attribute will keep it open instead. Useful for
   * dropdowns that allow for multiple interactions.
   */
  @property({ type: Boolean, reflect: true })
  stayopenonselect = false;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

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

  /**
   * Choose if position is `fixed` or `absolute`. `absolute` is more performant,
   * but `fixed` can solve issues with overflow clipping
   */
  @property({ type: Boolean })
  hoist = false;

  @property({ type: Boolean })
  disabled = false;

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

  protected firstUpdated(_changedProperties: PropertyValues): void {
    const input = this.triggerElements[0];
    if (input.tagName.toLowerCase() === 'mid-phone-input') {
      input.addEventListener('mid-country-click', this.handleCountryClick);
    } else if (input.tagName.toLowerCase() === 'mid-textfield') {
      console.log('found textfield');
    }

    this.panel.hidden = !this.open;

    const menu = this.getMenu();
    if (menu) {
      menu.variant = 'combobox';
    }

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
      setTimeout(() => {
        trigger.focus();
      }, 1);
    }
  }

  getMenu() {
    return this.panel
      .assignedElements({ flatten: true })
      .find((el) => el.tagName.toLowerCase() === 'mid-menu') as
      | MinidMenu
      | undefined;
  }

  getMenuSearch() {
    return this.getMenu()
      ?.defaultSlot.assignedElements({ flatten: true })
      .find((el) => el.tagName.toLowerCase() === 'mid-search') as
      | MinidSearch
      | undefined;
  }

  private handleCountryClick = () => {
    const menu = this.getMenu();
    menu?.clearFilter();

    this.open ? this.hide() : this.show();
    if (this.open && menu && menu.hasAttribute('searchable')) {
      // Delay focus slightly to win the focus battle
      setTimeout(() => {
        menu.focusSearchField();
      }, 1);
    }
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    // Close when escape is pressed inside an open dropdown. We need to listen on the panel itself and stop propagation
    // in case any ancestors are also listening for this key.
    if (this.open && event.key === 'Escape') {
      event.stopPropagation();
      this.hide();
      this.focusOnTrigger();
      return;
    }
  };

  private handleDocumentKeyDown = (event: KeyboardEvent) => {
    // Close when escape or tab is pressed
    if (event.key === 'Escape' && this.open && !this.#closeWatcher) {
      event.stopPropagation();
      this.focusOnTrigger();
      this.hide();
      return;
    }

    // Handle tabbing
    if (event.key === 'Tab') {
      // Tabbing within an open menu should close the dropdown and refocus the trigger
      if (
        this.open &&
        document.activeElement?.tagName.toLowerCase() === 'mid-menu-item'
      ) {
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
        const activeElement =
          this.containingElement?.getRootNode() instanceof ShadowRoot
            ? document.activeElement?.shadowRoot?.activeElement
            : document.activeElement;

        if (
          !this.containingElement ||
          activeElement?.closest(
            this.containingElement.tagName.toLowerCase()
          ) !== this.containingElement
        ) {
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

  private handlePanelSelect = (event: Event) => {
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

  /**
   * Instructs the dropdown menu to reposition. Useful when the position or size of the trigger changes when the menu
   * is activated.
   */
  reposition() {
    this.popup.reposition();
  }

  addOpenListeners() {
    this.panel.addEventListener('mid-select', this.handlePanelSelect);
    this.panel.addEventListener('keydown', this.handleKeyDown);

    if ('CloseWatcher' in window) {
      this.#closeWatcher?.destroy();
      this.#closeWatcher = new CloseWatcher();
      this.#closeWatcher.onclose = () => {
        this.hide();
        this.focusOnTrigger();
      };
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
    this.#closeWatcher?.destroy();
  }

  /** Shows the dropdown panel. */
  async show() {
    if (this.open) {
      return undefined;
    }

    this.open = true;
    return waitForEvent(this, 'mid-after-show');
  }

  /** Hides the dropdown panel */
  async hide() {
    if (!this.open) {
      return undefined;
    }

    this.open = false;
    return waitForEvent(this, 'mid-after-hide');
  }

  //
  // Slotted triggers can be arbitrary content, but we need to link them to the dropdown panel with `aria-haspopup` and
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
        id="dropdown"
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
        <slot class="dropdown__trigger" slot="anchor" name="trigger"> </slot>
        <div
          aria-hidden=${this.open ? 'false' : 'true'}
          aria-labelledby="dropdown"
        >
          <slot class="dropdown__panel" part="panel"></slot>
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
