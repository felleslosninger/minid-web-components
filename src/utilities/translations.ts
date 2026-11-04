/**
 * All UI strings that components render themselves (e.g. aria-labels on
 * icon-only buttons). Every supported language must provide all keys.
 */
export interface ComponentTranslations {
  clear: string;
  showPassword: string;
  hidePassword: string;
  /** Screen-reader label of the country-code control in `mid-phone-input` */
  countryCode: string;
  /** Screen-reader label of the number input in `mid-phone-input` */
  phoneNumber: string;
  /** Live announcement of the filtered country list, `%d` = count (singular) */
  countrySuggestionsSingular: string;
  /** Live announcement of the filtered country list, `%d` = count (plural) */
  countrySuggestionsPlural: string;
  /**
   * Description of the number input in `mid-phone-input`: the selected
   * country code. `{code}` = dial code, `{country}` = country name.
   */
  countryCodeSelected: string;
  /**
   * Polite announcement in `mid-phone-input` when an international number
   * typed into the number field switched the country. Same placeholders.
   */
  countryCodeChanged: string;
  close: string;
  loading: string;
  /** Close button on a closable `mid-alert` / toast */
  dismissAlert: string;
}

const builtins: Record<string, ComponentTranslations> = {
  nb: {
    clear: 'Tøm',
    showPassword: 'Vis passord',
    hidePassword: 'Skjul passord',
    countryCode: 'Landskode',
    phoneNumber: 'Telefonnummer',
    countrySuggestionsSingular: '%d land',
    countrySuggestionsPlural: '%d land',
    countryCodeSelected:
      'Landskode {code} ({country}) er valgt i feltet foran.',
    countryCodeChanged: 'Landskode endret til {code} ({country}).',
    close: 'Lukk',
    loading: 'Laster',
    dismissAlert: 'Lukk varsel',
  },
  nn: {
    clear: 'Tøm',
    showPassword: 'Vis passord',
    hidePassword: 'Gøym passord',
    countryCode: 'Landskode',
    phoneNumber: 'Telefonnummer',
    countrySuggestionsSingular: '%d land',
    countrySuggestionsPlural: '%d land',
    countryCodeSelected:
      'Landskode {code} ({country}) er vald i feltet framfor.',
    countryCodeChanged: 'Landskode endra til {code} ({country}).',
    close: 'Lukk',
    loading: 'Lastar',
    dismissAlert: 'Lukk varsel',
  },
  se: {
    clear: 'Sihko',
    showPassword: 'Čájet sátnesuodji',
    hidePassword: 'Čiehka sátnesuodji',
    countryCode: 'Riikkakoda',
    phoneNumber: 'Telefovdnanummir',
    countrySuggestionsSingular: '%d riika',
    countrySuggestionsPlural: '%d riika',
    countryCodeSelected:
      'Riikkakoda {code} ({country}) lea válljejuvvon ovddit gieddis.',
    countryCodeChanged: 'Riikkakoda rievdaduvvon: {code} ({country}).',
    close: 'Gidde',
    loading: 'Viežžamin',
    dismissAlert: 'Gidde dieđáhusa',
  },
  en: {
    clear: 'Clear',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    countryCode: 'Country code',
    phoneNumber: 'Phone number',
    countrySuggestionsSingular: '%d country',
    countrySuggestionsPlural: '%d countries',
    countryCodeSelected:
      'Country code {code} ({country}) is selected in the previous field.',
    countryCodeChanged: 'Country code changed to {code} ({country}).',
    close: 'Close',
    loading: 'Loading',
    dismissAlert: 'Dismiss alert',
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
    registry.get(lang) ?? registry.get(resolveBaseLang(lang)) ?? builtins.nb
  );
}

function resolveBaseLang(lang: string): string {
  return lang.toLowerCase().split('-')[0];
}
