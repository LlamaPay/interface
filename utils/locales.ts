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
    id: 'fr-FR',
  },
  {
    name: 'Português',
    id: 'pt-PT',
  },
  {
    name: 'Español',
    id: 'es-ES',
  },
  {
    name: 'Ελληνικά',
    id: 'el-GR',
  },
  {
    name: '日本語',
    id: 'ja-JP',
  },
];

export default localeNames;
