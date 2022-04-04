import BigNumber from 'bignumber.js';
import { IToken } from 'types';

export interface ICheckApproval {
  tokenDetails: IToken;
  userAddress?: string;
  approvedForAmount: string;
  checkTokenApproval: ({}) => void;
}

// TODO implement debounce
export function checkApproval({ tokenDetails, userAddress, approvedForAmount, checkTokenApproval }: ICheckApproval) {
  if (tokenDetails && userAddress) {
    const isAmountValid = checkIsAmountValid(approvedForAmount) && tokenDetails?.decimals;

    if (isAmountValid) {
      const amount = new BigNumber(approvedForAmount).multipliedBy(10 ** tokenDetails.decimals);

      checkTokenApproval({
        token: tokenDetails.tokenContract,
        userAddress: userAddress,
        approveForAddress: tokenDetails.llamaContractAddress,
        approvedForAmount: amount.toFixed(0),
      });
    }
  }
}

// function to check if the amount entered is in the right format
export function checkIsAmountValid(amount: string) {
  const regex = new RegExp('^[0-9]*[.,]?[0-9]*$');
  return regex.test(amount);
}
