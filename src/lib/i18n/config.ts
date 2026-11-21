export const LOCALES = ['pt-BR', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'pt-BR';

export const LOCALE_HEADER = 'x-locale';

export function localeFromHost(host: string | null | undefined): Locale {
  if (!host) return DEFAULT_LOCALE;
  const h = host.toLowerCase();
  if (h === 'swen.live' || h.endsWith('.swen.live') || h.startsWith('swen.live:')) {
    return 'en';
  }
  return DEFAULT_LOCALE;
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'pt-BR' || value === 'en';
}

const PT_ONLY_ON_SWEN_LIVE_EXACT_PATHS = new Set([
  '/retrospectiva/ia-2026',
  '/estado-ia-brasil-2026',
  '/benchmark/ptbr',
  '/benchmark/modelos-brasileiros',
]);

export function isPtOnlyPathOnEnPortal(pathname: string): boolean {
  const cleanPath =
    pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  return cleanPath.startsWith('/ranking/') || PT_ONLY_ON_SWEN_LIVE_EXACT_PATHS.has(cleanPath);
}
