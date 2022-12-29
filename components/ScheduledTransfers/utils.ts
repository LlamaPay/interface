import BigNumber from 'bignumber.js';

export const formatFrequency = (frequency: string) => {
  const days = Number(frequency) / (24 * 3600);

  if (days < 1) {
    const hours = Number(frequency) / 3600;

    if (hours < 1) {
      const minutes = Number(frequency) / 60;

      return (
        minutes.toLocaleString(undefined, {
          maximumFractionDigits: 4,
        }) +
        ' minute' +
        (minutes !== 1 ? 's' : '')
      );
    }

    return (
      hours.toLocaleString(undefined, {
        maximumFractionDigits: 4,
      }) +
      ' hour' +
      (hours !== 1 ? 's' : '')
    );
  }

  return (
    days.toLocaleString(undefined, {
      maximumFractionDigits: 4,
    }) +
    ' day' +
    (days !== 1 ? 's' : '')
  );
};

export const formatMaxPrice = (maxPrice: number, decimals: number) => {
  const decimalOffset = 10 ** (18 - Number(decimals));

  const usdPrice = new BigNumber(new BigNumber(1e28).div(decimalOffset)).div(Number(maxPrice)).toFixed(2);

  return Number(usdPrice);
};
