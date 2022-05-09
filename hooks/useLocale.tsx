import { useRouter } from 'next/router';
import localeNames, { ILocale } from 'utils/locales';

interface IReturnProps {
  locale: string;
  locales: ILocale[];
  updateLocale: (nextLocale: string) => Promise<boolean>;
}

export function useLocale(): IReturnProps {
  const { locale, pathname, asPath, query, push } = useRouter();

  const localeId = localeNames.find((item) => item.id === locale)?.id ?? 'en-CA';

  const updateLocale = (nextLocale: string) => {
    // change just the locale and maintain all other route information including href's query
    return push({ pathname, query }, asPath, { locale: nextLocale });
  };

  return { locale: localeId, locales: localeNames || [], updateLocale };
}
