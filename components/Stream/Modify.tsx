import * as React from 'react';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { DialogHeader, DialogWrapper, SetIsOpen } from 'components/Dialog';
import { llamapayABI } from 'utils/contract';
import { useContract, useSigner } from 'wagmi';
import BigNumber from 'bignumber.js';
interface ModifyProps {
  isOpen: boolean;
  setIsOpen: SetIsOpen;
  payer: string;
  payee: string;
  amtPerSec: number;
  contractAddress: string;
}

export const Modify = ({ isOpen, setIsOpen, payer, payee, amtPerSec, contractAddress }: ModifyProps) => {
  const [{ data: signerData }] = useSigner();

  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: llamapayABI,
    signerOrProvider: signerData,
  });

  const options = [
    { name: 'Week', seconds: 604800 },
    { name: 'Month', seconds: 2419200 },
    { name: 'Year', seconds: 29030400 },
  ];

  const [newPayee, setNewPayee] = React.useState<string>(payee);
  const [newAmtPerSec, setNewAmtPerSec] = React.useState<number>(amtPerSec);
  const [modifyButtonState, setModifyButtonState] = React.useState<string>('Modify Stream');
  const [secondIndex, setSecondIndex] = React.useState<number>(0);

  // TODO CHECKS AND STUFF
  const handleModifyInput = React.useCallback(() => {
    async function modifyStream() {
      try {
        // Replace with token decimals
        const realAmtPerSec = new BigNumber(newAmtPerSec).times(1e18).div(options[secondIndex].seconds).toFixed(0);
        await contract.modifyStream(payee, amtPerSec, newPayee, realAmtPerSec);
        setModifyButtonState('Success');
      } catch (error) {
        console.error(error);
      }
    }
    modifyStream();
  }, [contract, newPayee, newAmtPerSec]);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === 'payee') setNewPayee(value);
    if (name === 'amtpersec') setNewAmtPerSec(value);
  };

  const handlePeriodClick = React.useCallback(() => {
    if (secondIndex === options.length - 1) {
      setSecondIndex(0);
    } else {
      setSecondIndex(secondIndex + 1);
    }
  }, [secondIndex]);

  return (
    <>
      <DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <DialogHeader title="Modify Stream" setIsOpen={setIsOpen} />
        <div className="mt-3 flex flex-col space-y-2">
          <p className="text-md">Current Stream:</p>
          <div className="flex space-x-2">
            <span className=" text-sm">You</span>
            <ArrowRightIcon className="h-4 w-4" />
            <span className="truncate text-sm sm:max-w-[32ch] md:max-w-[48ch]"> {payee}</span>
          </div>
          <span className="text-sm"> Amount Per Second: {amtPerSec / 1e18}</span>
          <p className="text-md">New Stream:</p>
          <p className="text-sm">New Payee:</p>
          <input name="payee" className="text-sm" onChange={handleChange} value={newPayee} />
          <div className="flex space-x-1">
            <p className="text-sm">New Amount Per</p>
            <button className="text-sm" onClick={handlePeriodClick}>
              {options[secondIndex].name}
            </button>
          </div>
          <input name="amtpersec" className="text-sm" onChange={handleChange} />
          <button onClick={handleModifyInput}>{modifyButtonState}</button>
        </div>
      </DialogWrapper>
    </>
  );
};
