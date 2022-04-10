import { Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { useNetworkProvider } from 'hooks';
import { useMutation, useQueryClient } from 'react-query';
import { networkDetails } from 'utils/constants';
import { createFactoryWriteContract } from 'utils/contract';
import { useSigner } from 'wagmi';

interface ICreateContract {
  tokenAddress: string;
}

interface IDepositToken extends ICreateContract {
  factoryAddress: string | null;
  signer?: Signer;
}

const create = async ({ factoryAddress, signer, tokenAddress }: IDepositToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    }

    if (!tokenAddress) {
      throw new Error('Invalid address');
    }

    if (!factoryAddress) {
      throw new Error('Invalid Factory Address');
    }

    const contract = createFactoryWriteContract(factoryAddress, signer);
    return await contract.createLlamaPayContract(getAddress(tokenAddress));
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't create contract"));
  }
};

export default function useCreateLlamaPayContract() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  const { chainId } = useNetworkProvider();

  const factoryAddress = chainId ? networkDetails[chainId].llamapayFactoryAddress : null;

  return useMutation<any, any, ICreateContract>(
    ({ tokenAddress }: ICreateContract) => create({ factoryAddress, signer, tokenAddress }),
    {
      onSettled: () => {
        // TODO check if this fetched alltokens query
        queryClient.invalidateQueries();
      },
    }
  );
}
