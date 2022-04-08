import { Contract } from 'ethers';
import { useQuery } from 'react-query';

async function getWithdrawableData(contract: Contract, payer: string, payee: string, amountPerSec: number) {
  try {
    const res = await contract.withdrawable(payer, payee, amountPerSec);
    return {
      withdrawableAmount: res.withdrawableAmount,
      lastUpdate: res.lastUpdate,
      owed: res.owed,
    };
  } catch (error) {
    return null;
  }
}

function useWithdrawable(contract: Contract, payer: string, payee: string, amountPerSec: number) {
  return useQuery(
    ['withdrawable', contract, payer, payee, amountPerSec],
    () => getWithdrawableData(contract, payer, payee, amountPerSec),
    {
      refetchInterval: 10000,
    }
  );
}

export default useWithdrawable;
