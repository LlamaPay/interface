// function to check if the amount entered is in the right format
export function checkIsAmountValid(amount: string) {
  const trimmedAmount = amount.trim();

  if (trimmedAmount && trimmedAmount.length > 0) {
    const isNumber = !Number.isNaN(trimmedAmount) && Number(trimmedAmount) > 0;
    return isNumber;
  } else return false;
}
