// Use type safe message keys with `next-intl`
type Messages = typeof import('./translations/en.json');
declare interface IntlMessages extends Messages {}
