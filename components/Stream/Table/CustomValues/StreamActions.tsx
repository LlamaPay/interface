import { useDialogState } from 'ariakit';
import classNames from 'classnames';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { IStream } from 'types';
import { Cancel, Modify, Push, StreamHistory } from '.';

export const StreamActions = ({ data }: { data: IStream }) => {
  const modifyDialog = useDialogState();
  const historyDialog = useDialogState();
  const isIncoming = data.streamType === 'incomingStream';

  const { data: streamsAndHistory } = useStreamsAndHistory();

  return (
    <span className="relative flex justify-end gap-10">
      {isIncoming ? (
        <>
          <button className="row-action-links" onClick={historyDialog.toggle}>
            History
          </button>
          <Push buttonName="Withdraw" data={data} />
          <StreamHistory data={data} title="Stream History" dialog={historyDialog} />
        </>
      ) : (
        <>
          <Push buttonName="Send" data={data} />
          <button className="row-action-links" onClick={modifyDialog.toggle}>
            Modify
          </button>
          <button
            className={classNames('row-action-links', streamsAndHistory.hasBothStreamTypes && 'pr-[2ch]')}
            onClick={historyDialog.toggle}
          >
            History
          </button>
          <StreamHistory data={data} title="Stream History" dialog={historyDialog} />
          <Cancel data={data} />
          <Modify data={data} title="Modify" dialog={modifyDialog} />
        </>
      )}
    </span>
  );
};
