import { useDialogState } from 'ariakit';
import { IHistory } from 'types';
import { MoreInfo } from '../MoreInfo';

const HistoryActions = ({ data }: { data: IHistory }) => {
  const dialog = useDialogState();

  return (
    <span className="flex">
      <button className="ml-auto underline" onClick={dialog.toggle}>
        Details
      </button>
      <MoreInfo data={data} dialog={dialog} />
    </span>
  );
};

export default HistoryActions;
