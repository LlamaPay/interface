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
    name: 'Portuguese',
    id: 'pt',
  },
];

export default localeNames;
