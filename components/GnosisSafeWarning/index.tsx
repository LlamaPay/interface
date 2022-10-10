import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import * as React from 'react';

export default function GnosisSafeWarning() {
  const dialog = useDialogState();

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_SAFE === 'false' && window.location !== window.parent.location) {
      dialog.show();
    }
  }, []);

  return (
    <FormDialog title="Switch to Gnosis App" dialog={dialog}>
      <p>"idk what to put here"</p>
    </FormDialog>
  );
}
