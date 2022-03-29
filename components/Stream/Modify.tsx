import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { DialogHeader, DialogWrapper, SetIsOpen } from 'components/Dialog';
import { llamapayABI } from 'utils/contract';
import { useContract, useSigner } from 'wagmi';

interface ModifyProps {
    isOpen: boolean;
    setIsOpen: SetIsOpen;
    payer: string
    payee: string
    amtPerSec: number;
    contractAddress: string;
}

export const Modify = ({ isOpen, setIsOpen, payer, payee, amtPerSec, contractAddress }: ModifyProps) => {

    const [{ data: signerData }] = useSigner()

    const contract = useContract({
        addressOrName: contractAddress,
        contractInterface: llamapayABI,
        signerOrProvider: signerData
    })

    const [newPayee, setNewPayee] = React.useState<any>();
    const [newAmtPerSec, setNewAmtPerSec] = React.useState<any>();

    // TODO CHECKS AND STUFF
    const handleModifyInput = React.useCallback(() => {
        async function modifyStream() {
            await contract.modifyStream(payee, amtPerSec, newPayee, newAmtPerSec);
        }
        modifyStream();
    }, [contract, newPayee, newAmtPerSec])

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === "payee") setNewPayee(value);
        if (name === "amtpersec") setNewAmtPerSec(value);
    }

    return (
        <>
            <DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className="mt-3 flex flex-col space-y-2">
                    <DialogHeader title='Modify Stream' setIsOpen={setIsOpen} />
                    <p className='text-md'>Current Stream:</p>
                    <div className='flex space-x-2'>
                        <span className=" text-sm">You</span>
                        <ArrowRightIcon className="h-4 w-4" />
                        <span className="text-sm truncate sm:max-w-[32ch] md:max-w-[48ch]"> {payee}</span>
                    </div>
                    <span className='text-sm'> Amount Per Second: {amtPerSec / 1e18}</span>
                    <p className='text-md'>New Stream:</p>
                    <input name="payee" className='text-sm' onChange={handleChange}></input>
                    <input name="amtpersec" className='text-sm' onChange={handleChange}></input>
                    <button onClick={handleModifyInput}>Modify Stream</button>

                </div>
            </DialogWrapper>
        </>

    )
}
