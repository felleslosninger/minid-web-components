import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styled } from '../mixins/tailwind.mixin.ts';
import { MinidMenuItem } from './menu-item.component';
import { scrollIntoView } from '../internal/scroll';

declare global {
  interface HTMLElementTagNameMap {
    'mid-menu': MinidMenu;
  }
}

const styles = [
  css`
    :host {
      --max-height: none;
      --max-width: none;
    }
  `,
];

/**
 *  @event {{ detail: { item: MidMenuItem } }} mid-select - Emitted when a menu item is selected.
 */
@customElement('mid-menu')
export class MinidMenu extends styled(LitElement, styles) {
  @query('slot')
  defaultSlot!: HTMLSlotElement;

  @query('.filter-input')
  filterInput!: HTMLInputElement;

  @query('.item-list')
  itemList!: HTMLUListElement;

  /**
   * Adds an input element that filters selectable menu items
   */
  @property({ type: Boolean })
  searchable = false;

  /**
   * Wether the menu should be styled as a dropdown or a combobox
   */
  @property()
  variant: 'combobox' | 'dropdown' = 'dropdown';

  @state()
  isEmptyItemList = false;

  protected firstUpdated(): void {
    this.getAllItems().forEach((item) => {
      item.variant = this.variant;
      item.addEventListener('mouseenter', () => {
        this.setCurrentItem(item);
      });
    });
  }

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

  private handleFilterItems() {
    this.filter((item) =>
      item.innerText
        .toLowerCase()
        .includes(this.filterInput.value.toLowerCase())
    );

    const items = this.getAllSelectableItems();
    this.isEmptyItemList = items.length === 0;
    this.setCurrentItem(items[0]);
  }

  private scrollOptionIntoView(item: MinidMenuItem): void {
    scrollIntoView(item, this.itemList, 'vertical', 'auto');
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
      const items = this.getAllSelectableItems();
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
        this.scrollOptionIntoView(items[index]);

        if (!this.searchable) {
          items[index].focus();
        }
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
    const items = this.getAllSelectableItems();

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
   * Pass a filter function to enable/disable menu items in the menu
   * @type {(item: MinidMenuItem) => boolean}
   */
  filter = (filterFn: (item: MinidMenuItem) => boolean) => {
    this.getAllItems().forEach((item) => {
      if (filterFn(item)) {
        item.removeAttribute('hidden');
        item.removeAttribute('inert');
      } else {
        item.setAttribute('inert', 'true');
        item.setAttribute('hidden', 'true');
      }
    });
  };

  clearFilter() {
    this.filterInput.value = '';
    this.itemList.scrollTop = 0;
    this.filterInput.dispatchEvent(new Event('input'));
  }

  /**
   * @internal Gets all slotted menu items, ignoring dividers, headers, and other elements.
   */
  getAllSelectableItems() {
    return [
      ...(this.defaultSlot.assignedElements({
        flatten: true,
      }) as MinidMenuItem[]),
    ].filter((el) => !(el.inert || !this.isMenuItem(el)));
  }

  getAllItems() {
    return [
      ...(this.defaultSlot.assignedElements({
        flatten: true,
      }) as MinidMenuItem[]),
    ].filter((el) => this.isMenuItem(el));
  }

  /**
   * @internal Gets the current menu item, which is the menu item that has `tabindex="0"` within the roving tab index.
   * The menu item may or may not have focus, but for keyboard interaction purposes it's considered the "active" item.
   */
  getCurrentItem() {
    return this.getAllSelectableItems().find(
      (i) => i.getAttribute('tabindex') === '0'
    );
  }

  /**
   * @internal Sets the current menu item to the specified element. This sets `tabindex="0"` on the target element and
   * `tabindex="-1"` to all other items. This method must be called prior to setting focus on a menu item.
   */
  setCurrentItem(item: MinidMenuItem) {
    const items = this.getAllSelectableItems();

    // Update tab indexes
    items.forEach((i) => {
      i.setActive(i === item);
      i.setAttribute('tabindex', i === item ? '0' : '-1');
    });
  }

  focusSearchField() {
    if (this.searchable) {
      this.filterInput.focus();
    }
  }

  override render() {
    return html`
      <div class="border-neutral-subtle rounded-md border shadow-md">
        ${!this.searchable
          ? nothing
          : html`<div
              class="border-neutral-subtle flex items-center gap-2 border-b p-2"
            >
              <mid-icon
                class="text-6"
                slot="prefix"
                library="system"
                name="magnifying-glass"
              >
              </mid-icon>
              <input
                @input=${this.handleFilterItems}
                @keydown=${this.handleKeyDown}
                class="filter-input border-neutral-subtle focus-visible:outline-focus-outer h-8 w-full rounded border px-2"
                type="search"
              />
            </div>`}
        <ul
          class="item-list max-h-(--max-height) max-w-(--max-width) overflow-y-auto px-2 py-3"
        >
          <slot
            @slotchange=${this.handleSlotChange}
            @click=${this.handleClick}
            @keydown=${this.handleKeyDown}
            @mousedown=${this.handleMouseDown}
          ></slot>
          ${this.isEmptyItemList
            ? html`<div class="p-2">Fant ingen treff</div>`
            : nothing}
        </ul>
      </div>
    `;
  }
}
