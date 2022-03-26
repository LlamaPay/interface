import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { XIcon } from '@heroicons/react/solid';

export type SetIsOpen = React.Dispatch<React.SetStateAction<boolean>>;

interface DialogProps {
  isOpen: boolean;
  setIsOpen: SetIsOpen;
  children: React.ReactNode;
}

interface DialogHeaderProps {
  title: string;
  setIsOpen: SetIsOpen;
}

function closeModal(setIsOpen: SetIsOpen) {
  setIsOpen(false);
}

export const DialogWrapper = ({ isOpen, setIsOpen, children }: DialogProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto " onClose={() => closeModal(setIsOpen)}>
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
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export const DialogHeader = ({ title, setIsOpen }: DialogHeaderProps) => {
  return (
    <>
      <Dialog.Title as="h3" className="text-base font-medium leading-6 text-neutral-700 dark:text-neutral-200">
        {title}
      </Dialog.Title>
      <button
        className="absolute top-6 right-4 rounded hover:bg-neutral-200 dark:hover:bg-zinc-800"
        onClick={() => closeModal(setIsOpen)}
      >
        <span className="sr-only">Close</span>
        <XIcon className="h-5 w-5" />
      </button>
    </>
  );
};
