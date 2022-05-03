import * as React from 'react';
import disperseContract from 'abis/disperseContract';
import { DisclosureState } from 'ariakit';
import BigNumber from 'bignumber.js';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { networkDetails } from 'utils/constants';
import { useContractWrite, useNetwork } from 'wagmi';
import { useQueryClient } from 'react-query';
import { useTranslations } from 'next-intl';

interface DisperseSendProps {
  dialog: DisclosureState;
  data: { [key: string]: number };
  setTransactionHash: React.Dispatch<React.SetStateAction<string>>;
  transactionDialog: DisclosureState;
}

export default function DisperseSend({ dialog, data, setTransactionHash, transactionDialog }: DisperseSendProps) {
  const [{ data: network }] = useNetwork();
  const [{ loading }, disperseEther] = useContractWrite(
    {
      addressOrName: networkDetails[Number(network.chain?.id)].disperseAddress,
      contractInterface: disperseContract,
    },
    'disperseEther'
  );

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

    disperseEther({
      args: [recipients, values],
      overrides: {
        value: ether.toString(),
      },
    }).then((data) => {
      if (data.error) {
        dialog.hide();
        toast.error(data.error.message);
      } else {
        const toastId = toast.loading('Dispersing Gas');
        setTransactionHash(data.data?.hash ?? '');
        dialog.hide();
        transactionDialog.show();

        data.data?.wait().then((receipt) => {
          toast.dismiss(toastId);
          receipt.status === 1 ? toast.success('Successfully Dispersed Gas') : toast.error('Failed to Disperse Gas');
          queryClient.invalidateQueries();
        });
      }
    });
  }

  const t = useTranslations('Streams');

  return (
    <button onClick={sendGas} type="button" className="form-submit-button mt-5">
      {loading ? <BeatLoader size={6} color="white" /> : t('send')}
    </button>
  );
}
