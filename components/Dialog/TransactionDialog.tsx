import * as React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { DisclosureState } from 'ariakit';
import { Dialog, DialogDismiss } from 'ariakit/dialog';
import classNames from 'classnames';
import { useChainExplorer } from 'hooks';

interface FormDialogProps {
  dialog: DisclosureState;
  transactionHash: string;
  className?: string;
}

export const TransactionDialog = ({ dialog, className, transactionHash }: FormDialogProps) => {
  const { url, name } = useChainExplorer();

  return (
    <Dialog
      state={dialog}
      className={classNames(
        'absolute top-8 left-4 right-4 bottom-8 z-50 m-auto mx-auto mt-auto flex h-fit max-h-[80vh] max-w-lg flex-col overflow-auto rounded-lg bg-zinc-100 p-4 drop-shadow-lg dark:bg-zinc-800 sm:left-8 sm:right-8',
        className
      )}
    >
      <header className="relative">
        <DialogDismiss className="ml-auto flex items-start justify-end">
          <XIcon className="h-6 w-6" />
        </DialogDismiss>
      </header>
      <div className="my-10 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className=""
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="16 12 12 8 8 12"></polyline>
          <line x1="12" y1="16" x2="12" y2="8"></line>
        </svg>
      </div>
      <h1 className="text-center">Transaction Submitted</h1>
      <a
        className="mt-1 mb-8 text-center text-sm text-green-700 dark:text-green-500"
        href={url ? `${url}/tx/${transactionHash}` : '/'}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on {name || 'Block Explorer'}
      </a>
      <button className="mt-auto rounded-lg bg-green-200 p-3 dark:text-black" onClick={dialog.toggle}>
        Close
      </button>
    </Dialog>
  );
};
