import { useDialogState } from 'ariakit';
import { useTranslations } from 'next-intl';
import { IHistory } from 'types';
import { MoreInfo } from './MoreInfo';

export const HistoryActions = ({ data }: { data: IHistory }) => {
  const dialog = useDialogState();

  const t = useTranslations('History');

  if (data.eventType === 'Deposit' || data.eventType === 'Withdraw') return null;

  return (
    <>
      <span className="flex">
        <button className="row-action-links ml-auto" onClick={dialog.toggle}>
          {t('details')}
        </button>
      </span>
      {data.stream ? <MoreInfo data={data} dialog={dialog} /> : ''}
    </>
  );
};
