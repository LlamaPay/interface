import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import * as React from 'react';

export default function GnosisSafeWarning() {
  const dialog = useDialogState();

  React.useEffect(() => {
    const origin: string | undefined | null = window.location.ancestorOrigins[0];
    if (process.env.NEXT_PUBLIC_SAFE === 'false' && origin === 'https://gnosis-safe.io') {
      dialog.show();
    }
  }, []);

  return (
    <FormDialog title="Switch to Gnosis App" dialog={dialog}>
      <p>"idk what to put here"</p>
    </FormDialog>
  );
}
