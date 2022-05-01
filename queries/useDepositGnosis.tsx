import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { SendTransactionsResponse } from '@gnosis.pm/safe-apps-sdk';
import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk/dist/src/sdk';
import { TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk';
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

      return await sdk.txs.send({ txs: transactions });
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't deposit token"));
  }
}

export default function useDepositGnosis() {
  const [{ data: signer }] = useSigner();
  const { sdk } = useSafeAppsSDK();

  return useMutation(
    ({ llamaContractAddress, tokenContractAddress, amountToDeposit }: IUseDepositGnosis) =>
      deposit({ signer, sdk, llamaContractAddress, tokenContractAddress, amountToDeposit }),
    {}
  );
}
