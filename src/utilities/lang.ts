/**
 * Gets the effective language for a given element by walking up the DOM tree,
 * traversing shadow DOM host boundaries along the way.
 */
export function getLang(element: HTMLElement): string {
  let current: Node | null = element;

  while (current) {
    if (current instanceof Element && current.hasAttribute('lang')) {
      return current.getAttribute('lang')!;
    }
    // Cross shadow-DOM host boundary
    if (current instanceof ShadowRoot) {
      current = (current as ShadowRoot).host;
    } else {
      current = current.parentNode;
    }
  }

  return document.documentElement.lang || 'nb';
}