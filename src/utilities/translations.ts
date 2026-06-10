/**
 * All UI strings that components render themselves (e.g. aria-labels on
 * icon-only buttons). Every supported language must provide all keys.
 */
export interface ComponentTranslations {
  clear: string;
  showPassword: string;
  hidePassword: string;
  openCountrySelector: string;
  close: string;
}


const builtins: Record<string, ComponentTranslations> = {
  nb: {
    clear: 'Tøm',
    showPassword: 'Vis passord',
    hidePassword: 'Skjul passord',
    openCountrySelector: 'Åpne landsvelger',
    close: 'Lukk',
  },
  nn: {
    clear: 'Tøm',
    showPassword: 'Vis passord',
    hidePassword: 'Gøym passord',
    openCountrySelector: 'Opna landsveljar',
    close: 'Lukk',
  },
  se: {
    clear: 'Sihko',
    showPassword: 'Čájet sátnesuodji',
    hidePassword: 'Čiehka sátnesuodji',
    openCountrySelector: 'Rahpat riikkaválljenjoavkku',
    close: 'Gidde',
  },
  en: {
    clear: 'Clear',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    openCountrySelector: 'Open country selector',
    close: 'Close',
  },
};

const registry = new Map<string, ComponentTranslations>(
  Object.entries(builtins)
);

/**
 * Override or extend translations for a given BCP-47 language tag.
 * Merges the provided strings with the existing entry for that tag, so you
 * only need to supply the keys you want to change.
 *
 * Call this once at app startup, before any components render.
 *
 * @example Override a single string for Norwegian Bokmål
 * ```ts
 * setTranslations('nb', { clear: 'Slett' });
 * ```
 *
 * @example Register a completely new language
 * ```ts
 * setTranslations('fr', {
 *   clear: 'Effacer',
 *   showPassword: 'Afficher le mot de passe',
 *   hidePassword: 'Masquer le mot de passe',
 * });
 * ```
 */
export function setTranslations(
  lang: string,
  translations: Partial<ComponentTranslations>
): void {
  const base = resolveBaseLang(lang);
  const existing = registry.get(lang) ?? registry.get(base) ?? builtins.nb;
  registry.set(lang, { ...existing, ...translations });
}

/**
 * Returns the translations for the given BCP-47 language tag.
 *
 * Resolution order:
 *   1. Exact tag match (e.g. `'nb-NO'`)
 *   2. Base language match (e.g. `'nb'` from `'nb-NO'`)
 *   3. Norwegian Bokmål as final fallback
 */
export function getTranslations(lang: string): ComponentTranslations {
  return (
    registry.get(lang) ??
    registry.get(resolveBaseLang(lang)) ??
    builtins.nb
  );
}

function resolveBaseLang(lang: string): string {
  return lang.toLowerCase().split('-')[0];
}