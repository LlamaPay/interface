import { useQuery } from '@tanstack/react-query';
import { Contract } from 'ethers';

interface IUseWithdrawableProps {
  contract: Contract;
  payer: string;
  payee: string;
  amountPerSec: string;
  streamId: string;
}

interface IGetWithdrawable {
  contract: Contract;
  payer: string;
  payee: string;
  amountPerSec: string;
}

export async function getWithdrawableData({ contract, payer, payee, amountPerSec }: IGetWithdrawable) {
  try {
    const call = await contract.withdrawable(payer, payee, amountPerSec);
    return {
      withdrawableAmount: call.withdrawableAmount,
      lastUpdate: call.lastUpdate,
      owed: call.owed,
    };
  } catch (error: any) {
    // console.log(error);
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch payments info"));
  }
}

function useWithdrawable({ contract, payer, payee, amountPerSec, streamId }: IUseWithdrawableProps) {
  return useQuery(['withdrawable', streamId], () => getWithdrawableData({ contract, payer, payee, amountPerSec }), {
    refetchInterval: 30000,
  });
}

export default useWithdrawable;
