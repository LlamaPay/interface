import { useDialogState } from 'ariakit';
import { useTranslations } from 'next-intl';
import type { ISalaryHistory } from '~/queries/salary/useGetSalaryInfo';
import { MoreInfo } from './MoreInfo';
import { WithdrawInvoice } from './WithdrawInvoice';
import { useNetworkProvider } from '~/hooks';
import { networkDetails } from '~/lib/networkDetails';

export const HistoryActions = ({ data }: { data: ISalaryHistory }) => {
  const dialog = useDialogState();
  const { chainId } = useNetworkProvider();
  const t = useTranslations('History');

  return (
    <>
      <span className="flex space-x-2">
        {chainId && (
          <button className=" row-action-links ml-auto">
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={`${networkDetails[chainId].blockExplorerURL}tx/${data.txHash}`}
            >{`${networkDetails[chainId].blockExplorerName}`}</a>
          </button>
        )}
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
