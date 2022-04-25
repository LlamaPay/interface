import * as React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { DisclosureState } from 'ariakit';
import { Dialog, DialogDismiss, DialogHeading } from 'ariakit/dialog';
import classNames from 'classnames';

interface FormDialogProps {
  dialog: DisclosureState;
  title: string | React.ReactNode | null;
  children: React.ReactNode;
  className?: string;
}

export const FormDialog = ({ dialog, title, className, children }: FormDialogProps) => {
  return (
    <Dialog state={dialog} className={classNames('dialog', className)}>
      <header className="font-exo relative flex items-center justify-between text-lg font-medium">
        <DialogHeading>{title}</DialogHeading>
        <DialogDismiss className="flex items-start justify-end">
          <XIcon className="h-6 w-6" />
        </DialogDismiss>
      </header>
      <div className="mt-4">{children}</div>
    </Dialog>
  );
};
