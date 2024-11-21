import { css, html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import { styled } from 'mixins/tailwind.mixin.ts';
import { MinidMenuItem } from 'src/components/menu-item.component';

const styles = [
  css`
    :host {
      --max-height: none;
    }

    ul {
      max-height: var(--max-height);
      overflow-y: auto;
    }
  `,
];

@customElement('mid-menu')
export class MinidMenu extends styled(LitElement, styles) {
  @query('slot')
  defaultSlot!: HTMLSlotElement;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'menu');
  }

  private handleClick(event: MouseEvent) {
    const menuItemTypes = ['menuitem', 'menuitemcheckbox'];

    const composedPath = event.composedPath();
    const target = composedPath.find((el) =>
      menuItemTypes.includes((el as HTMLElement)?.getAttribute?.('role') || '')
    );

    if (!target) return;

    const closestMenu = composedPath.find(
      (el) => (el as HTMLElement)?.getAttribute?.('role') === 'menu'
    );
    const clickHasSubmenu = closestMenu !== this;

    // Make sure we're the menu thats supposed to be handling the click event.
    if (clickHasSubmenu) {
      return;
    }

    // This isn't true. But we use it for TypeScript checks below.
    const item = target as MinidMenuItem;

    // if (item.type === 'checkbox') {
    //   item.checked = !item.checked;
    // }

    this.dispatchEvent(
      new CustomEvent('mid-select', {
        bubbles: true,
        composed: true,
        detail: { item },
      })
    );
  }

  private handleKeyDown(event: KeyboardEvent) {
    // Make a selection when pressing enter or space
    if (event.key === 'Enter' || event.key === ' ') {
      const item = this.getCurrentItem();
      event.preventDefault();
      event.stopPropagation();

      // Simulate a click to support @click handlers on menu items that also work with the keyboard
      item?.click();
    }

    // Move the selection when pressing down or up
    else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      const items = this.getAllItems();
      const activeItem = this.getCurrentItem();
      let index = activeItem ? items.indexOf(activeItem) : 0;

      if (items.length > 0) {
        event.preventDefault();
        event.stopPropagation();

        if (event.key === 'ArrowDown') {
          index++;
        } else if (event.key === 'ArrowUp') {
          index--;
        } else if (event.key === 'Home') {
          index = 0;
        } else if (event.key === 'End') {
          index = items.length - 1;
        }

        if (index < 0) {
          index = items.length - 1;
        }
        if (index > items.length - 1) {
          index = 0;
        }

        this.setCurrentItem(items[index]);
        items[index].focus();
      }
    }
  }

  private handleMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (this.isMenuItem(target)) {
      this.setCurrentItem(target as MinidMenuItem);
    }
  }

  private handleSlotChange() {
    const items = this.getAllItems();

    // Reset the roving tab index when the slotted items change
    if (items.length > 0) {
      this.setCurrentItem(items[0]);
    }
  }

  private isMenuItem(item: HTMLElement) {
    return (
      item.tagName.toLowerCase() === 'mid-menu-item' ||
      ['menuitem', 'menuitemcheckbox', 'menuitemradio'].includes(
        item.getAttribute('role') ?? ''
      )
    );
  }

  /**
   * @internal Gets all slotted menu items, ignoring dividers, headers, and other elements.
   */
  getAllItems() {
    return [
      ...(this.defaultSlot.assignedElements({
        flatten: true,
      }) as HTMLElement[]),
    ].filter((el) => {
      if (el.inert || !this.isMenuItem(el)) {
        return false;
      }
      return true;
    }) as MinidMenuItem[];
  }

  /**
   * @internal Gets the current menu item, which is the menu item that has `tabindex="0"` within the roving tab index.
   * The menu item may or may not have focus, but for keyboard interaction purposes it's considered the "active" item.
   */
  getCurrentItem() {
    return this.getAllItems().find((i) => i.getAttribute('tabindex') === '0');
  }

  /**
   * @internal Sets the current menu item to the specified element. This sets `tabindex="0"` on the target element and
   * `tabindex="-1"` to all other items. This method must be called prior to setting focus on a menu item.
   */
  setCurrentItem(item: MinidMenuItem) {
    const items = this.getAllItems();

    // Update tab indexes
    items.forEach((i) => {
      i.setAttribute('tabindex', i === item ? '0' : '-1');
    });
  }

  override render() {
    return html`<ul class="fds-dropdownmenu fds-dropdownmenu--md">
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    </ul> `;
  }
}
