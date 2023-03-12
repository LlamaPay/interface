export const pieColors = ['#22C497', '#46E8CA', '#9D42D5', '#EEB626', '#22B1C4'];

export const pieChartBreakDown = (tokenPrices = {}) =>
  'conic-gradient(' +
  Object.keys(tokenPrices)
    .map((_x, index) => `${pieColors[index] || pieColors[4]} ${100 / Object.keys(tokenPrices).length}%`)
    .join(',') +
  `,${pieColors[Object.keys(tokenPrices).length - 1] || pieColors[4]})`;
