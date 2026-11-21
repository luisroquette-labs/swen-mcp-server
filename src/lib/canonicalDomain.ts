export const CANONICAL_DOMAIN = 'https://swen.ia.br';
export const INSTAGRAM_HANDLE = '@swen.ia.br';
export const SITE_URL = 'swen.ia.br';
export const EMAIL_CONTACT = 'contato@swen.ia.br';
export const OG_IMAGE_URL = `${CANONICAL_DOMAIN}/og-image.png`;
export const LOGO_URL = `${CANONICAL_DOMAIN}/pwa-512x512.png`;

export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${CANONICAL_DOMAIN}${cleanPath}`;
}

export function buildNewsUrl(slugOrId: string): string {
  return buildCanonicalUrl(`/noticia/${slugOrId}`);
}

export function buildCategoryUrl(category: string): string {
  const slug = category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return buildCanonicalUrl(`/categoria/${slug}`);
}

export function buildDynamicCanonicalUrl(baseUrl: string, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

import { DEFAULT_LOCALE, type Locale } from './i18n/config';

export const EN_CANONICAL_DOMAIN = 'https://swen.live';

const CANONICAL_DOMAIN_BY_LOCALE: Record<Locale, string> = {
  'pt-BR': CANONICAL_DOMAIN,
  en: EN_CANONICAL_DOMAIN,
};

export function canonicalDomainForLocale(locale: Locale = DEFAULT_LOCALE): string {
  return CANONICAL_DOMAIN_BY_LOCALE[locale] ?? CANONICAL_DOMAIN;
}

export function buildCanonicalUrlForLocale(locale: Locale, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${canonicalDomainForLocale(locale)}${cleanPath}`;
}

export function ogImageForLocale(locale: Locale = DEFAULT_LOCALE): string {
  return `${canonicalDomainForLocale(locale)}/og-image.png`;
}

export function truncateForSeo(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max + 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut.slice(0, max)).trimEnd() + '…';
}

export function hreflangAlternates(path: string): {
  'pt-BR': string;
  en: string;
  'x-default': string;
} {
  return {
    'pt-BR': buildCanonicalUrlForLocale('pt-BR', path),
    en: buildCanonicalUrlForLocale('en', path),
    'x-default': buildCanonicalUrlForLocale(DEFAULT_LOCALE, path),
  };
}
