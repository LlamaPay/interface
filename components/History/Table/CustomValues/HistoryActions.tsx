import { useDialogState } from 'ariakit';
import { useTranslations } from 'next-intl';
import { IHistory } from 'types';
import { MoreInfo } from './MoreInfo';
import { WithdrawInvoice } from './WithdrawInvoice';

export const HistoryActions = ({ data }: { data: IHistory }) => {
  const dialog = useDialogState();

  const t = useTranslations('History');

  if (data.eventType === 'Deposit') return null;

  return (
    <>
      <span className="flex">
        {data.eventType === 'Withdraw' ? (
          <WithdrawInvoice data={data} />
        ) : (
          <button className="row-action-links ml-auto" onClick={dialog.toggle}>
            {t('details')}
          </button>
        )}
      </span>
      {data.stream ? <MoreInfo data={data} dialog={dialog} /> : ''}
    </>
  );
};
