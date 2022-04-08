import { useQuery } from 'react-query';
import { useContract, useSigner } from 'wagmi';
import { Contract } from 'ethers';
import llamaContract from 'abis/llamaContract';

async function getWithdrawableData(contract: Contract, payer: string, payee: string, amountPerSec: number) {
  try {
    const call = await contract.withdrawable(payer, payee, amountPerSec);
    return {
      withdrawableAmount: call.withdrawableAmount,
      lastUpdate: call.lastUpdate,
      owed: call.owed,
    };
  } catch (error) {
    return null;
  }
}

function useWithdrawable(contractAddress: string, payer: string, payee: string, amountPerSec: number) {
  const [{ data: signerData }] = useSigner();
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: llamaContract,
    signerOrProvider: signerData,
  });

  return useQuery(
    ['withdrawable', contractAddress, payer, payee, amountPerSec],
    () => getWithdrawableData(contract, payer, payee, amountPerSec),
    {
      refetchInterval: 10000,
    }
  );
}

export default useWithdrawable;
