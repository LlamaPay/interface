import disperseContract from 'abis/disperseContract';
import BigNumber from 'bignumber.js';
import React from 'react';
import toast from 'react-hot-toast';
import { networkDetails } from 'utils/constants';
import { useContractWrite, useNetwork } from 'wagmi';

interface DisperseSendProps {
  data: { [key: string]: number };
}

export default function DisperseSend({ data }: DisperseSendProps) {
  const [{ data: network }] = useNetwork();
  const [{}, disperseEther] = useContractWrite(
    {
      addressOrName: networkDetails[Number(network.chain?.id)].disperseAddress,
      contractInterface: disperseContract,
    },
    'disperseEther'
  );
  function sendGas() {
    if (Number(network.chain?.id) === 43113) {
      toast.error('DO NOT USE ON FUJI');
      return;
    }
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
      const loading = data.error ? toast.error(data.error.message) : toast.loading('Dispersing Gas');
      data.data?.wait().then((receipt) => {
        toast.dismiss(loading);
        receipt.status === 1 ? toast.success('Successfully Dispersed Gas') : toast.error('Failed to Disperse Gas');
      });
    });
  }

  return (
    <button onClick={sendGas} type="button" className="w-full rounded-xl bg-[#23BD8F] py-2">
      Send
    </button>
  );
}
