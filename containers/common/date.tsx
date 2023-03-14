export function daysInMonth(month: string, year: string) {
  return new Date(parseInt(year), parseInt(month) + 1, 0).getDate();
}

export const currentYear = new Date().getUTCFullYear();

export const yearOptions: Array<number> = [];

for (let i = 2022; i <= currentYear + 1; i++) {
  yearOptions.push(i);
}

export const months: Array<
  [
    number,
    (
      | 'january'
      | 'february'
      | 'march'
      | 'april'
      | 'may'
      | 'june'
      | 'july'
      | 'august'
      | 'september'
      | 'october'
      | 'november'
      | 'december'
    )
  ]
> = [
  [0, 'january'],
  [1, 'february'],
  [2, 'march'],
  [3, 'april'],
  [4, 'may'],
  [5, 'june'],
  [6, 'july'],
  [7, 'august'],
  [8, 'september'],
  [9, 'october'],
  [10, 'november'],
  [11, 'december'],
];
