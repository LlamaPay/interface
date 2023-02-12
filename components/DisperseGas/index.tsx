import * as React from 'react';
import { DisclosureState, useDialogState } from 'ariakit';
import { FormDialog, TransactionDialog } from '~/components/Dialog';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from '~/hooks';
import SendToPayees from './SendToPayees';
import useStreamsAndHistory from '~/queries/useStreamsAndHistory';
import type { IStream } from '~/types';
import DisperseFallback from './Fallback';
import { useTranslations } from 'next-intl';

function DisperseGasMoney({ dialog }: { dialog: DisclosureState }) {
  const { address, isConnecting } = useAccount();
  const { nativeCurrency } = useNetworkProvider();
  const transactionDialog = useDialogState();
  const [transactionHash, setTransactionHash] = React.useState<string>('');

  const { data, isLoading, error } = useStreamsAndHistory();

  const t = useTranslations('Disperse');

  const { initialPayeeData, noStreams } = React.useMemo(() => {
    if (data && address) {
      const accountAddress = address.toLowerCase();
      const newTable: { [key: string]: string } = {};
      data.streams?.forEach((p: IStream) => {
        if (accountAddress === p.payerAddress.toLowerCase()) {
          newTable[p.payeeAddress.toLowerCase()] = '0';
        }
      });
      return {
        initialPayeeData: newTable,
        noStreams: Object.keys(newTable).length === 0 && newTable.constructor === Object,
      };
    } else return { initialPayeeData: {}, noStreams: true };
  }, [data, address]);

  const showFallback = isConnecting || isLoading || error || noStreams;

  return (
    <>
      <FormDialog
        dialog={dialog}
        title={t('disperseTokentoYourPayees', { token: nativeCurrency?.symbol ?? '' })}
        className="v-min h-min"
      >
        <div className="space-y-3">
          {showFallback ? (
            <DisperseFallback isLoading={isLoading} isError={error ? true : false} noData={noStreams} />
          ) : (
            <SendToPayees
              dialog={dialog}
              setTransactionHash={setTransactionHash}
              transactionDialog={transactionDialog}
              initialPayeeData={initialPayeeData}
            />
          )}
        </div>
      </FormDialog>
      <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />
    </>
  );
}

export default DisperseGasMoney;
