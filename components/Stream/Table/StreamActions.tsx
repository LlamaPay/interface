import { useDialogState } from 'ariakit';
import { IStream } from 'types';
import { Cancel } from '../Cancel';
import { Modify } from '../Modify';
import { Push } from '../Push';
import { StreamHistory } from '../StreamHistory';

const StreamActions = ({ data }: { data: IStream }) => {
  const modifyDialog = useDialogState();
  const historyDialog = useDialogState();
  const isIncoming = data.streamType === 'incomingStream';
  return (
    <span className="relative flex justify-end gap-10">
      {isIncoming ? (
        <Push buttonName="Withdraw" data={data} />
      ) : (
        <>
          <Push buttonName="Send" data={data} />
          <button className="row-action-links" onClick={modifyDialog.toggle}>
            Modify
          </button>
          <Cancel data={data} />
          <Modify data={data} title="Modify" dialog={modifyDialog} />
        </>
      )}
      <button className="row-action-links" onClick={historyDialog.toggle}>
        History
      </button>
      <StreamHistory data={data} title="Stream History" dialog={historyDialog} />
    </span>
  );
};

export default StreamActions;
