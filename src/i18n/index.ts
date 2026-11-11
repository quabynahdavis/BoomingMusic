let currentLocale = 'en';
let cache: Record<string, Record<string, string>> = {};

export async function loadLocale(locale: string): Promise<void> {
  const response = await fetch(`/i18n/locales/${locale}.json`);
  if (!response.ok) throw new Error(`Locale ${locale} not found`);
  cache[locale] = await response.json();
  currentLocale = locale;
  localStorage.setItem('locale', locale);
}

export function t(key: string, params: Record<string, string> = {}): string {
  const str = cache[currentLocale]?.[key] || key;
  return Object.entries(params).reduce((s, [k, v]) => s.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v), str);
}

export function getLocale(): string {
  return currentLocale;
}

export function setLocale(locale: string): void {
  currentLocale = locale;
  localStorage.setItem('locale', locale);
  window.dispatchEvent(new CustomEvent('locale-changed', { detail: locale }));
}

export function initLocale(): Promise<void> {
  const saved = localStorage.getItem('locale') || 'en';
  return loadLocale(saved).catch(() => loadLocale('en'));
}