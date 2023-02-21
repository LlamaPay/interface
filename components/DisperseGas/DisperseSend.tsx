import * as React from 'react';
import { disperseContractABI } from '~/lib/abis/disperseContract';
import { DisclosureState } from 'ariakit';
import BigNumber from 'bignumber.js';
import toast from 'react-hot-toast';
import { BeatLoader } from '~/components/BeatLoader';
import { networkDetails } from '~/lib/networkDetails';
import { useContractWrite, useNetwork } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

interface DisperseSendProps {
  dialog: DisclosureState;
  data: { [key: string]: number };
  setTransactionHash: React.Dispatch<React.SetStateAction<string>>;
  transactionDialog: DisclosureState;
}

export default function DisperseSend({ dialog, data, setTransactionHash, transactionDialog }: DisperseSendProps) {
  const { chain } = useNetwork();
  const { isLoading, writeAsync: disperseEther } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: networkDetails[Number(chain?.id)].disperseAddress as `0x${string}`,
    abi: disperseContractABI,
    functionName: 'disperseEther',
  });

  const queryClient = useQueryClient();

  function sendGas() {
    let ether = new BigNumber(0);
    const recipients: string[] = [];
    const values: string[] = [];
    Object.keys(data).map((p) => {
      recipients.push(p);
      const value = new BigNumber(data[p]).times(1e18).toFixed(0);
      values.push(value.toString());
      ether = ether.plus(value);
    });

    disperseEther?.({
      recklesslySetUnpreparedArgs: [recipients, values],
      recklesslySetUnpreparedOverrides: {
        value: Number(ether.toString()),
      },
    })
      .then((data) => {
        const toastId = toast.loading('Dispersing Gas');
        setTransactionHash(data.hash ?? '');
        dialog.hide();
        transactionDialog.show();

        data.wait().then((receipt) => {
          toast.dismiss(toastId);
          receipt.status === 1 ? toast.success('Successfully Dispersed Gas') : toast.error('Failed to Disperse Gas');
          queryClient.invalidateQueries();
        });
      })
      .catch((err) => {
        dialog.hide();
        toast.error(err.message);
      });
  }

  const t = useTranslations('Streams');

  return (
    <button onClick={sendGas} type="button" className="form-submit-button mt-5">
      {isLoading ? <BeatLoader size="6px" color="white" /> : t('send')}
    </button>
  );
}
