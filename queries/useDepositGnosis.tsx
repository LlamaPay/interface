import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk/dist/src/sdk';
import { Signer } from 'ethers';
import { useMutation } from 'react-query';
import { ERC20Interface, LlamaContractInterface } from 'utils/contract';
import { useSigner } from 'wagmi';

interface IUseDepositGnosis {
  llamaContractAddress: string;
  tokenContractAddress: string;
  amountToDeposit: string;
}

interface IDepositGnosis extends IUseDepositGnosis {
  signer?: Signer;
  sdk?: SafeAppsSDK;
}

async function deposit({ signer, sdk, llamaContractAddress, tokenContractAddress, amountToDeposit }: IDepositGnosis) {
  try {
    if (!signer || !sdk) {
      throw new Error("Couldn't get signer or SDK");
    } else {
      const approve = ERC20Interface.encodeFunctionData('approve', [llamaContractAddress, amountToDeposit]);
      console.log(approve);
      const deposit = LlamaContractInterface.encodeFunctionData('deposit', [amountToDeposit]);
      console.log(deposit);
      const transactions = [
        {
          to: tokenContractAddress,
          value: '0',
          data: approve,
        },
        {
          to: llamaContractAddress,
          value: '0',
          data: deposit,
        },
      ];

      const tx = await sdk.txs.send({ txs: transactions });
      console.log(tx);
      return tx;
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't deposit token"));
  }
}

export default function useDepositGnosis() {
  const [{ data: signer }] = useSigner();
  const { sdk } = useSafeAppsSDK();

  console.log(sdk);

  return useMutation(
    ({ llamaContractAddress, tokenContractAddress, amountToDeposit }: IUseDepositGnosis) =>
      deposit({ signer, sdk, llamaContractAddress, tokenContractAddress, amountToDeposit }),
    {}
  );
}
