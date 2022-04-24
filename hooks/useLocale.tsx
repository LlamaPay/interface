import { useRouter } from 'next/router';

export function useLocale(): { locale: string; locales: string[] } {
  const { locale, locales } = useRouter();

  return { locale: locale || 'en-US', locales: locales || [] };
}
