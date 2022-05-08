import { useLocale } from 'hooks';
import React from 'react';
import { IHistory } from 'types';
import { downloadInvoice } from 'utils/downloadInvoice';
import { useAccount } from 'wagmi';

export function WithdrawInvoice({ data }: { data: IHistory }) {
  const { locale } = useLocale();
  const [{ data: accountData }] = useAccount();
  const onDownloadInvoice = React.useCallback(() => {
    downloadInvoice(data, locale, accountData?.address ?? '');
  }, [data, locale, accountData]);
  return (
    <button className="row-action-links ml-auto" onClick={onDownloadInvoice}>
      Invoice
    </button>
  );
}
