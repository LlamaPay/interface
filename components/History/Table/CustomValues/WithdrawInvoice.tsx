import * as React from 'react';
import { useLocale } from '~/hooks';
import { useTranslations } from 'next-intl';
import type { IHistory } from '~/queries/salary/useGetSalaryInfo';
import { downloadInvoice } from '~/utils/downloadInvoice';
import { useAccount } from 'wagmi';

export function WithdrawInvoice({ data }: { data: IHistory }) {
  const { locale } = useLocale();
  const { address } = useAccount();
  const t0 = useTranslations('History');
  const onDownloadInvoice = React.useCallback(() => {
    downloadInvoice(data, locale, address || '');
  }, [data, locale, address]);
  return (
    <button className="row-action-links ml-auto" onClick={onDownloadInvoice}>
      {t0('invoice')}
    </button>
  );
}
