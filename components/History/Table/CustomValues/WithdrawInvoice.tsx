import * as React from 'react';
import { useLocale } from 'hooks';
import { useTranslations } from 'next-intl';
import { IHistory } from 'types';
import { downloadInvoice } from 'utils/downloadInvoice';
import { useAccount } from 'wagmi';

export function WithdrawInvoice({ data }: { data: IHistory }) {
  const { locale } = useLocale();
  const [{ data: accountData }] = useAccount();
  const t0 = useTranslations('History');
  const onDownloadInvoice = React.useCallback(() => {
    downloadInvoice(data, locale, accountData?.address ?? '');
  }, [data, locale, accountData]);
  return (
    <button className="row-action-links ml-auto" onClick={onDownloadInvoice}>
      {t0('invoice')}
    </button>
  );
}
