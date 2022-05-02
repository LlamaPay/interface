import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk/dist/src/sdk';
import { useMutation } from 'react-query';

interface IUseGnosisBatch {
  calls: { [key: string]: string[] };
}

interface IGnosisBatch extends IUseGnosisBatch {
  sdk?: SafeAppsSDK;
}

async function batchCall({ sdk, calls }: IGnosisBatch) {
  try {
    if (!sdk) {
      throw new Error("Couldn't get SDK");
    } else {
      const transactions: {
        to: string;
        value: string;
        data: string;
      }[] = [];

      Object.keys(calls).forEach((p) => {
        calls[p].forEach((q) => {
          transactions.push({
            to: p,
            value: '0',
            data: q,
          });
        });
      });

      await sdk.txs.send({ txs: transactions });
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? 'Batch failed'));
  }
}

export default function useGnosisBatch() {
  const { sdk } = useSafeAppsSDK();

  return useMutation(({ calls }: IUseGnosisBatch) => batchCall({ sdk, calls }));
}
