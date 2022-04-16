import { useDialogState } from 'ariakit';
import { IHistory } from 'types';
import { MoreInfo } from '../MoreInfo';

const HistoryActions = ({ data }: { data: IHistory }) => {
  const dialog = useDialogState();

  return (
    <span className="flex">
      <button className="row-action-links ml-auto" onClick={dialog.toggle}>
        Details
      </button>
      <MoreInfo data={data} dialog={dialog} />
    </span>
  );
};

export default HistoryActions;
