import * as React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { DisclosureState } from 'ariakit';
import { Dialog, DialogDismiss } from 'ariakit/dialog';
import classNames from 'classnames';
import { useChainExplorer } from 'hooks';
import { useTranslations } from 'next-intl';

interface FormDialogProps {
  dialog: DisclosureState;
  transactionHash: string;
  className?: string;
}

export const TransactionDialog = ({ dialog, className, transactionHash }: FormDialogProps) => {
  const { url, name, id } = useChainExplorer();

  const t = useTranslations('Common');

  return (
    <Dialog state={dialog} className={classNames('dialog', className)}>
      <header className="font-exo relative">
        <DialogDismiss className="ml-auto flex items-start justify-end">
          <span className="sr-only">{t('close')}</span>
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
      <h1 className="text-center">{t('transactionSubmitted')}</h1>
      <a
        className="mt-1 mb-8 text-center text-sm text-green-700"
        href={url ? (id === 82 || id === 1088 ? `${url}tx/${transactionHash}` : `${url}/tx/${transactionHash}`) : '/'}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('viewOnExplorer', { explorer: name || 'Block Explorer' })}
      </a>
      <button className="form-submit-button" onClick={dialog.toggle}>
        {t('close')}
      </button>
    </Dialog>
  );
};
