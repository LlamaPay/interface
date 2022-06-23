import * as React from 'react';
import { ArrowDownIcon, ArrowUpIcon, PencilIcon } from '@heroicons/react/solid';
import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import Tooltip from 'components/Tooltip';
import { useAddressStore } from 'store/address';
import { IStream } from 'types';
import { formatAddress } from 'utils/address';
import Link from 'next/link';
import { useNetworkProvider } from 'hooks';
import { useTranslations } from 'next-intl';

export function SavedName({ data }: { data: IStream }) {
  // check the stream type (incoming or outgoing)
  const isIncoming = data.streamType === 'incomingStream';

  const address = isIncoming ? data.payerAddress : data.payeeAddress;

  const { network } = useNetworkProvider();

  const dialog = useDialogState();

  const updateAddress = useAddressStore((state) => state.updateAddress);

  const name =
    useAddressStore((state) => state.addressBook.find((p) => p.id?.toLowerCase() === address.toLowerCase()))
      ?.shortName ?? formatAddress(address);

  const [savedAddress, setSavedAddress] = React.useState(name);

  React.useEffect(() => {
    setSavedAddress(name);
  }, [name]);

  const updateName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateAddress(address.toLowerCase(), savedAddress);
    dialog.toggle();
  };

  function clearName() {
    setSavedAddress(formatAddress(address));
    updateAddress(address.toLowerCase(), formatAddress(address));
  }

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Streams');

  return (
    <div className="flex items-center gap-2 truncate">
      <Link href={`/salaries/withdraw/${network}/${data.streamId}`} passHref>
        {isIncoming ? (
          <a className="flex cursor-pointer items-center gap-2 truncate">
            <Tooltip content={t1('incomingStream')}>
              <div className="rounded bg-green-100 p-1 text-green-600">
                <span className="sr-only">{t1('incomingStream')}</span>
                <ArrowDownIcon className="h-4 w-4" />
              </div>
            </Tooltip>
            <span className="dark:text-white">{name}</span>
          </a>
        ) : (
          <a className="flex cursor-pointer items-center gap-2 truncate">
            <Tooltip content={t1('outgoingStream')}>
              <div className="rounded bg-red-100 p-1 text-red-600">
                <span className="sr-only">{t1('outgoingStream')}</span>
                <ArrowUpIcon className="h-4 w-4" />
              </div>
            </Tooltip>
            <span className="dark:text-white">{name}</span>
          </a>
        )}
      </Link>
      <button className="ml-auto rounded p-1 hover:bg-zinc-200 hover:dark:bg-stone-700" onClick={dialog.toggle}>
        <span className="sr-only">{t1('editName')}</span>
        <PencilIcon className="h-4 w-4 dark:text-white" />
      </button>
      <FormDialog dialog={dialog} title="Custom Name" className="h-fit">
        <form onSubmit={updateName}>
          <label>
            <span>{t0('edit')}</span>
            <button onClick={clearName} className="float-right text-sm underline underline-offset-1">
              {'Clear'}
            </button>
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
          <button className="form-submit-button mt-5">{t0('update')}</button>
        </form>
      </FormDialog>
    </div>
  );
}
