import { useDialogState } from 'ariakit';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { IStream } from 'types';
import { Cancel, Modify, Push, StreamHistory } from '.';
import Pause from './Pause';
import Resume from './Resume';

export const StreamActions = ({ data, historyOnly }: { data: IStream; historyOnly?: boolean }) => {
  const modifyDialog = useDialogState();

  const isIncoming = data.streamType === 'incomingStream';

  const { data: streamsAndHistory } = useStreamsAndHistory();

  if (historyOnly) {
    return (
      <span className="relative flex justify-end gap-10">
        <StreamHistory data={data} title="Stream History" />
      </span>
    );
  }

  return (
    <span className="relative flex justify-end gap-10">
      {isIncoming ? (
        <>
          <StreamHistory data={data} title="Stream History" />
          <Push buttonName="Withdraw" data={data} />
        </>
      ) : (
        <>
          <Push buttonName="Send" data={data} />
          <button className="row-action-links" onClick={modifyDialog.toggle}>
            Modify
          </button>
          {data.paused ? <Resume data={data} /> : <Pause data={data} />}
          <StreamHistory
            data={data}
            title="Stream History"
            className={streamsAndHistory.hasBothStreamTypes && 'pr-[2ch]'}
          />
          <Cancel data={data} />
          <Modify data={data} title="Modify" dialog={modifyDialog} />
        </>
      )}
    </span>
  );
};
