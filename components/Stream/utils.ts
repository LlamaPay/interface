// function to check if the amount entered is in the right format
export function checkIsAmountValid(amount: string) {
  const regex = new RegExp('^[0-9]*[.,]?[0-9]*$');
  return regex.test(amount);
}
