import BigNumber from 'bignumber.js';
import debounce from 'lodash.debounce';
import { IToken } from 'types';

type TokenDetails = Pick<IToken, 'decimals' | 'tokenContract' | 'llamaContractAddress'>;

export interface ICheckApproval {
  tokenDetails: TokenDetails;
  userAddress?: string;
  approvedForAmount: string;
  checkTokenApproval: ({}) => void;
}

function checkTokenApproval({ tokenDetails, userAddress, approvedForAmount, checkTokenApproval }: ICheckApproval) {
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

export const checkApproval = debounce(checkTokenApproval, 200);

// function to check if the amount entered is in the right format
export function checkIsAmountValid(amount: string) {
  const regex = new RegExp('^[0-9]*[.,]?[0-9]*$');
  return regex.test(amount);
}
