import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk/dist/src/sdk';
import { useMutation } from 'react-query';
import { ERC20Interface, LlamaContractInterface } from 'utils/contract';

interface IUseDepositGnosis {
  llamaContractAddress: string;
  tokenContractAddress: string;
  amountToDeposit: string;
}

interface IDepositGnosis extends IUseDepositGnosis {
  sdk?: SafeAppsSDK;
}

async function deposit({ sdk, llamaContractAddress, tokenContractAddress, amountToDeposit }: IDepositGnosis) {
  try {
    if (!sdk) {
      throw new Error("Couldn't get SDK");
    } else {
      const approve = ERC20Interface.encodeFunctionData('approve', [llamaContractAddress, amountToDeposit]);
      const deposit = LlamaContractInterface.encodeFunctionData('deposit', [amountToDeposit]);
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

      await sdk.txs.send({ txs: transactions });
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't deposit token"));
  }
}

export default function useDepositGnosis() {
  const sdk = typeof window !== 'undefined' ? new SafeAppsSDK() : undefined;

  return useMutation(
    ({ llamaContractAddress, tokenContractAddress, amountToDeposit }: IUseDepositGnosis) =>
      deposit({ sdk, llamaContractAddress, tokenContractAddress, amountToDeposit }),
    {}
  );
}
