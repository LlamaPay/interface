import BigNumber from 'bignumber.js';
import { getAddress } from 'ethers/lib/utils';
import { Provider } from '~/hooks/useNetworkProvider';
import debounce from 'lodash.debounce';
import type { IToken } from '~/types';
import { createERC20Contract } from '~/utils/tokenUtils';

type TokenDetails = Pick<IToken, 'decimals' | 'tokenContract' | 'llamaContractAddress'>;

export interface ICheckApproval {
  tokenDetails: TokenDetails;
  userAddress?: string;
  approvedForAmount: string;
  checkTokenApproval: ({}) => void;
}

interface ICreateAndCheckApproval {
  tokenAddress: string;
  userAddress: string;
  approvedForAmount: string;
  provider: Provider;
  approvalFn: ({}) => void;
  approveForAddress: string;
}

function checkTokenApproval({ tokenDetails, userAddress, approvedForAmount, checkTokenApproval }: ICheckApproval) {
  if (tokenDetails && userAddress && approvedForAmount) {
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

async function createTokenContractAndCheckApproval({
  tokenAddress,
  approvedForAmount,
  userAddress,
  provider,
  approvalFn,
  approveForAddress,
}: ICreateAndCheckApproval) {
  try {
    const tokenContract = createERC20Contract({ tokenAddress: getAddress(tokenAddress), provider });
    const decimals = await tokenContract.decimals();

    checkTokenApproval({
      tokenDetails: { tokenContract, llamaContractAddress: approveForAddress, decimals },
      userAddress,
      approvedForAmount,
      checkTokenApproval: approvalFn,
    });
  } catch (error) {
    console.log(error);
  }
}

export const checkApproval = debounce(checkTokenApproval, 200);
export const createContractAndCheckApproval = debounce(createTokenContractAndCheckApproval, 200);

// function to check if the amount entered is in the right format
export function checkIsAmountValid(amount: string) {
  const regex = new RegExp('^[0-9]*[.,]?[0-9]*$');
  return regex.test(amount);
}
