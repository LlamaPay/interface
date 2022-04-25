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
    name: 'French',
    id: 'fr',
  },
];

export default localeNames;
