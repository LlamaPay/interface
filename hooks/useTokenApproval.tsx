import * as React from 'react';
import { BigNumber, Contract } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { checkHasApprovedEnough } from 'utils/tokenUtils';
import { erc20ABI, useAccount, useContract, useSigner } from 'wagmi';

interface IApproveTokenProps {
  tokenAddress: string;
  tokenContract: Contract;
  approvedForAmount: BigNumber;
}

// TODO REFACTOR THIS WHOLE THING AND FIX UNNECESSARY RERENDERS
const useSignerAndUserData = () => {
  const [{ data: signer, error: signerDataError, loading: signerLoading }] = useSigner();

  const [{ data: accountData, error: accountDataError, loading: accountDataLoading }] = useAccount();

  const isLoading = React.useMemo(() => {
    return signerLoading || accountDataLoading;
  }, [signerLoading, accountDataLoading]);

  const error = React.useMemo(() => {
    if (accountDataError || signerDataError) {
      return 'Something went wrong';
    } else {
      return null;
    }
  }, [signerDataError, accountDataError]);

  return { isLoading: isLoading, error, signer: signer, address: accountData?.address };
};

const useTokenApproval = ({ tokenAddress, tokenContract, approvedForAmount }: IApproveTokenProps) => {
  const [isApproved, setIsApproved] = React.useState(false);
  const { isLoading: signerDataLoading, error: signerDataError, signer, address } = useSignerAndUserData();

  const tokenContractToWrite = useContract({
    addressOrName: getAddress(tokenAddress),
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  });

  const approvalLoading = React.useRef(false);
  const approvalError = null;

  const hasApprovedEnough = React.useCallback(async () => {
    if (signerDataLoading || signerDataError || !address || !signer) return false;

    try {
      approvalLoading.current = true;
      const { res, err } = await checkHasApprovedEnough({
        token: tokenContract,
        userAddress: address,
        approveForAddress: tokenAddress,
        approvedForAmount: approvedForAmount,
      });
      setIsApproved(res);
    } catch (error) {
      // console.log(error)
      // setError('Something went wrong');
    } finally {
      approvalLoading.current = false;
    }
  }, [tokenAddress, approvedForAmount, tokenContract, address, signerDataLoading, signerDataError, signer]);

  React.useEffect(() => {
    hasApprovedEnough();
  }, [hasApprovedEnough]);

  const isLoading = React.useMemo(() => {
    if (approvalLoading.current || signerDataLoading) {
      return true;
    } else return false;
  }, [approvalLoading, signerDataLoading]);

  const error = React.useMemo(() => {
    if (signerDataError || approvalError) {
      return 'Something went wrong';
    } else {
      return null;
    }
  }, [approvalError, signerDataError]);

  return { isLoading, isApproved, tokenContractToWrite, error };
};

export default useTokenApproval;
