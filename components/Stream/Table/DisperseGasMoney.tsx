import { Tab } from '@headlessui/react';
import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import React from 'react';
import DisperseForm from './DisperseForm';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from 'hooks';
import SendToPayees from './SendToPayees';

export function DisperseGasMoney() {
  const disperseDialog = useDialogState();
  const [{ data: accountData }] = useAccount();
  const { unsupported, nativeCurrency } = useNetworkProvider();

  return (
    <>
      <button onClick={disperseDialog.toggle} className="secondary-button">
        {` Disperse ${nativeCurrency?.symbol}`}
      </button>
      <FormDialog
        dialog={disperseDialog}
        title={` Disperse ${nativeCurrency?.symbol} to Users`}
        className="v-min h-min"
      >
        <div className="space-y-3">
          {accountData && !unsupported ? (
            <Tab.Group>
              <Tab.List className="flex space-x-3">
                <Tab
                  className={({ selected }) =>
                    selected ? 'rounded-3xl bg-[#23BD8F] px-4 py-2' : 'rounded-3xl bg-[#ffffff] px-4 py-2'
                  }
                >
                  <span className="font-inter ">Disperse Tokens</span>
                </Tab>
                <Tab
                  className={({ selected }) =>
                    selected ? 'rounded-3xl bg-[#23BD8F] px-4 py-2' : 'rounded-3xl bg-[#ffffff] px-4 py-2'
                  }
                >
                  <span className="font-inter ">Send to Payees</span>
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <DisperseForm />
                </Tab.Panel>
                <Tab.Panel>
                  <SendToPayees />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          ) : (
            <>
              {!accountData ? <p>Connect Wallet</p> : <></>}
              {unsupported ? <p>Unsupported Chain</p> : <></>}
            </>
          )}
        </div>
      </FormDialog>
    </>
  );
}
