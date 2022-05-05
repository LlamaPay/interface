export interface ILocale {
  name: string;
  id: string;
}

const localeNames: ILocale[] = [
  {
    name: 'English',
    id: 'en',
  },
  {
    name: 'Français',
    id: 'fr',
  },
  {
    name: 'Português',
    id: 'pt',
  },
  {
    name: 'Español',
    id: 'es',
  },
  {
    name: 'Ελληνικά',
    id: 'el',
  },
];

export default localeNames;
