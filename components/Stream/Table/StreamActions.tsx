import { useDialogState } from 'ariakit';
import { IStream } from 'types';
import { Cancel } from '../Cancel';
import { Modify } from '../Modify';
import { Push } from '../Push';

const StreamActions = ({ data }: { data: IStream }) => {
  const dialog = useDialogState();
  const isIncoming = data.streamType === 'incomingStream';
  return (
    <span className="relative right-[-8px] flex justify-end space-x-4">
      {isIncoming ? (
        <Push buttonName="Withdraw" data={data} />
      ) : (
        <>
          <Push buttonName="Send" data={data} />
          <button className="rounded py-1 px-2 underline" onClick={dialog.toggle}>
            Modify
          </button>
          <Cancel data={data} />
          <Modify data={data} title="Modify" dialog={dialog} />
        </>
      )}
    </span>
  );
};

export default StreamActions;
