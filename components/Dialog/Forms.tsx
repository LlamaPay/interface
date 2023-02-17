import * as React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { DisclosureState } from 'ariakit';
import { Dialog, DialogDismiss, DialogHeading } from 'ariakit/dialog';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

interface FormDialogProps {
  dialog: DisclosureState;
  title: string | React.ReactNode | null;
  children: React.ReactNode;
  className?: string;
}

export const FormDialog = ({ dialog, title, className, children }: FormDialogProps) => {
  const t = useTranslations('Common');

  return (
    <Dialog state={dialog} className={classNames('dialog', className)}>
      <header className="font-exo relative flex items-center justify-between text-lg font-medium">
        <DialogHeading>{title}</DialogHeading>
        <DialogDismiss className="flex items-start justify-end">
          <span className="sr-only">{t('close')}</span>
          <XMarkIcon className="h-6 w-6" />
        </DialogDismiss>
      </header>
      <div className="mt-4">{children}</div>
    </Dialog>
  );
};
