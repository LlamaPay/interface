import * as React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { DisclosureState } from 'ariakit';
import { Dialog, DialogDismiss, DialogHeading } from 'ariakit/dialog';
import classNames from 'classnames';

interface FormDialogProps {
  dialog: DisclosureState;
  title: string | null;
  children: React.ReactNode;
  className?: string;
}

export const FormDialog = ({ dialog, title, className, children }: FormDialogProps) => {
  return (
    <Dialog
      state={dialog}
      className={classNames(
        'absolute top-8 left-4 right-4 bottom-8 z-50 m-auto mx-auto mt-auto flex max-h-[80vh] max-w-lg flex-col overflow-auto rounded bg-zinc-100 p-4 drop-shadow-lg dark:bg-zinc-800 sm:left-8 sm:right-8',
        className
      )}
    >
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
