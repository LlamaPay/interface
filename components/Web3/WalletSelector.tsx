import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';
import { useIsMounted } from 'hooks';
import { XIcon } from '@heroicons/react/solid';
import { formatAddress } from 'lib/address';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WalletSelector = ({ isOpen, setIsOpen }: Props) => {
  const [{ data: accountData }, disconnect] = useAccount();

  function closeModal() {
    setIsOpen(false);
  }

  const isMounted = useIsMounted();
  const [
    {
      data: { connectors },
    },
    connect,
  ] = useConnect();

  const handleConnect = React.useCallback(
    async (connector: Connector) => {
      const { data, error } = await connect(connector);
    },
    [connect]
  );

  const formattedAddress = accountData && formatAddress(accountData.address);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto " onClose={closeModal}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-lg transition-all dark:bg-black dark:shadow-[#060606]">
              {accountData ? (
                <>
                  <DialogHeader title="Account" closeModal={closeModal} />
                  <div className="mt-3 flex flex-col space-y-2">
                    <p className="text-sm font-thin">{`Connected with ${accountData.connector?.name}`}</p>
                    <p className="break-words">
                      {accountData.ens?.name ? `${accountData.ens?.name} (${formattedAddress})` : accountData.address}
                    </p>
                    <button className="nav-button rounded p-2" onClick={disconnect}>
                      Disconnect
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <DialogHeader title="Connect a Wallet" closeModal={closeModal} />
                  <div className="mt-3 flex flex-col space-y-2">
                    {connectors.map((x) => (
                      <button key={x.id} onClick={() => handleConnect(x)} className="rounded border p-2">
                        {isMounted ? x.name : x.id === 'injected' ? x.id : x.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

interface DialogHeaderProps {
  title: string;
  closeModal: () => void;
}

const DialogHeader = ({ title, closeModal }: DialogHeaderProps) => {
  return (
    <>
      <Dialog.Title as="h3" className="text-base font-medium leading-6 text-neutral-700 dark:text-neutral-200">
        {title}
      </Dialog.Title>
      <button
        className="absolute top-6 right-4 rounded hover:bg-neutral-200 dark:hover:bg-zinc-800"
        onClick={closeModal}
      >
        <span className="sr-only">Close</span>
        <XIcon className="h-5 w-5" />
      </button>
    </>
  );
};
