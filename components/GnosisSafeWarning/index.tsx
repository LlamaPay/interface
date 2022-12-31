import { useDialogState } from 'ariakit';
import { FormDialog } from '~/components/Dialog';
import { useNetworkProvider } from '~/hooks';
import * as React from 'react';
import { useAccount } from 'wagmi';

export default function GnosisSafeWarning() {
  const dialog = useDialogState();
  const { provider } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();

  React.useEffect(() => {
    async function checkCode() {
      if (accountData?.address) {
        const isContract = (await provider?.getCode(accountData?.address)) !== '0x';
        if (isContract) {
          dialog.show();
        }
      }
    }
    if (process.env.NEXT_PUBLIC_SAFE === 'false') {
      checkCode();
      if (window.location !== window.parent.location) {
        dialog.show();
      }
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
