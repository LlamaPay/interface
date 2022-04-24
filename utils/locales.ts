export interface ILocale {
  name: string;
  id: string;
}

const localeNames: ILocale[] = [
  {
    name: 'English (US)',
    id: 'en-US',
  },
  {
    name: 'English (UK)',
    id: 'en-GB',
  },
  {
    name: 'French',
    id: 'fr',
  },
];

export default localeNames;
