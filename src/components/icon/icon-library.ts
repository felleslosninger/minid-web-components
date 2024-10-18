import defaultLibrary from './nav-aksel.icon-library.js';
import systemLibrary from './system.icon-library.js';
import type { MinidIcon } from './icon.component.js';

export type IconLibraryResolver<T = any> = (name: T) => string;
export type IconLibraryMutator = (svg: SVGElement) => void;
export interface IconLibrary<T = any> {
  name: string;
  resolver: IconLibraryResolver<T>;
  mutator?: IconLibraryMutator;
}

let registry: IconLibrary[] = [defaultLibrary, systemLibrary];
let watchedIcons: MinidIcon[] = [];

/** Adds an icon to the list of watched icons. */
export function watchIcon(icon: MinidIcon) {
  watchedIcons.push(icon);
}

/** Removes an icon from the list of watched icons. */
export function unwatchIcon(icon: MinidIcon) {
  watchedIcons = watchedIcons.filter((el) => el !== icon);
}

/** Returns a library from the registry. */
export function getIconLibrary(name?: string) {
  return registry.find((lib) => lib.name === name);
}

/** Adds an icon library to the registry, or overrides an existing one. */
export function registerIconLibrary(
  name: string,
  options: Omit<IconLibrary, 'name'>
) {
  unregisterIconLibrary(name);
  registry.push({
    name,
    resolver: options.resolver,
    mutator: options.mutator,
  });

  // Redraw watched icons
  watchedIcons.forEach((icon) => {
    if (icon.library === name) {
      icon.setIcon();
    }
  });
}

/** Removes an icon library from the registry. */
export function unregisterIconLibrary(name: string) {
  registry = registry.filter((lib) => lib.name !== name);
}
