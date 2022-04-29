import { useDialogState } from 'ariakit';
import { IHistory } from 'types';
import { MoreInfo } from '../MoreInfo';

const HistoryActions = ({ data }: { data: IHistory }) => {
  const dialog = useDialogState();

  if (data.eventType !== 'Deposit' && data.eventType !== 'Withdraw') {
    return (
      <>
        <span className="flex">
          <button className="row-action-links ml-auto" onClick={dialog.toggle}>
            Details
          </button>
        </span>
        {data.stream ? <MoreInfo data={data} dialog={dialog} /> : ''}
      </>
    );
  }
  return null
};

export default HistoryActions;
