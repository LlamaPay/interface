import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import Link from 'next/link';
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
      <div className="mt-1 space-y-2">
        <p>{'You are currently not on the LlamaPay Gnosis app!'}</p>
        <p>{'Please switch to the Gnosis app to have full functionality.'}</p>
        <a
          href="https://docs.llamapay.io/llamapay/gnosis-safe"
          target="_blank"
          rel="noreferrer noopener"
          className="underline"
        >
          Read More
        </a>
      </div>
    </FormDialog>
  );
}
