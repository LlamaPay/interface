import * as React from 'react';
import { ArrowDownIcon, ArrowUpIcon, PencilIcon } from '@heroicons/react/solid';
import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import Tooltip from 'components/Tooltip';
import { useAddressStore } from 'store/address';
import { IStream } from 'types';

export default function SavedName({ data }: { data: IStream }) {
  // check the stream type (incoming or outgoing)
  const isIncoming = data.streamType === 'incomingStream';

  const address = isIncoming ? data.payerAddress : data.payeeAddress;

  const dialog = useDialogState();

  const updateAddress = useAddressStore((state) => state.updateAddress);

  const name = useAddressStore((state) => state.addressBook.find((p) => p.id === address))?.shortName ?? address;

  const [savedAddress, setSavedAddress] = React.useState(name);

  const updateName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateAddress(address, savedAddress);
    dialog.toggle();
  };

  return (
    <div className="flex items-center gap-2 truncate">
      {isIncoming ? (
        <>
          <Tooltip content="Incoming stream">
            <div className="rounded bg-green-100 p-1 text-green-600">
              <span className="sr-only">Incoming stream from</span>
              <ArrowDownIcon className="h-4 w-4" />
            </div>
          </Tooltip>
          <span>{name}</span>
        </>
      ) : (
        <>
          <Tooltip content="Outgoing stream">
            <div className="rounded bg-red-100 p-1 text-red-600">
              <span className="sr-only">Outgoing stream to</span>
              <ArrowUpIcon className="h-4 w-4" />
            </div>
          </Tooltip>
          <span>{name}</span>
        </>
      )}
      <button className="ml-4 rounded p-1 hover:bg-zinc-200 hover:dark:bg-stone-700" onClick={dialog.toggle}>
        <span className="sr-only">Edit payee address name</span>
        <PencilIcon className="h-4 w-4" />
      </button>
      <FormDialog dialog={dialog} title="" className="h-fit">
        <form onSubmit={updateName}>
          <label>
            <span>Edit</span>
            <input
              name="updatedName"
              className="w-full rounded border border-neutral-300 px-3 py-[11px] slashed-zero dark:border-neutral-700 dark:bg-stone-800"
              value={savedAddress}
              onChange={(e) => setSavedAddress(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              type="text"
              spellCheck="false"
              required
            />
          </label>
          <small className="truncate opacity-70">({address})</small>
          <button className="mt-4 w-full rounded-lg bg-green-200 p-3 dark:text-black">Update</button>
        </form>
      </FormDialog>
    </div>
  );
}
