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
  const { unsupported } = useNetworkProvider();

  return (
    <>
      <button
        onClick={disperseDialog.toggle}
        className="whitespace-nowrap rounded-[10px] border border-[#1BDBAD] bg-[#23BD8F] py-2 px-5 text-sm font-bold text-white shadow-[0px_3px_7px_rgba(0,0,0,0.12)]"
      >
        Send Gas Money
      </button>
      <FormDialog dialog={disperseDialog} title="Disperse Coins to Multiple Addresses for Gas" className="v-min h-min">
        <div className="space-y-3">
          {accountData && !unsupported ? (
            <Tab.Group>
              <Tab.List className="flex space-x-3">
                <Tab
                  className={({ selected }) =>
                    selected ? 'rounded-xl bg-[#23BD8F] px-4 py-2' : 'rounded-xl bg-[#ffffff] px-4 py-2'
                  }
                >
                  <span className="font-inter ">Send to Payees</span>
                </Tab>
                <Tab
                  className={({ selected }) =>
                    selected ? 'rounded-xl bg-[#23BD8F] px-4 py-2' : 'rounded-xl bg-[#ffffff] px-4 py-2'
                  }
                >
                  <span className="font-inter ">Custom</span>
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <SendToPayees />
                </Tab.Panel>
                <Tab.Panel>
                  <DisperseForm />
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
