import { useRouter } from 'next/router';

interface IReturnProps {
  locale: string;
  locales: string[];
  updateLocale: (nextLocale: string) => Promise<boolean>;
}

export function useLocale(): IReturnProps {
  const { locale, locales, pathname, asPath, query, push } = useRouter();

  const updateLocale = (nextLocale: string) => {
    // change just the locale and maintain all other route information including href's query
    return push({ pathname, query }, asPath, { locale: nextLocale });
  };

  return { locale: locale || 'en-US', locales: locales || [], updateLocale };
}
