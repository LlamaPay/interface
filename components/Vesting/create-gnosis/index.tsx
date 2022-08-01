import { InputText, SubmitButton } from 'components/Form';
import Link from 'next/link';
import useGnosisBatch from 'queries/useGnosisBatch';
import { ArrowCircleLeftIcon } from '@heroicons/react/outline';
import { useFieldArray, useForm } from 'react-hook-form';
import BigNumber from 'bignumber.js';
import { secondsByDuration } from 'utils/constants';
import toast from 'react-hot-toast';
import { createERC20Contract } from 'utils/tokenUtils';
import { getAddress, Interface } from 'ethers/lib/utils';
import { useProvider } from 'wagmi';
import React from 'react';
import vestingFactoryReadable from 'abis/vestingFactoryReadable';
import { ERC20Interface } from 'utils/contract';

type FormValues = {
  vestingContracts: {
    recipientAddress: string;
    vestedAmount: string;
    vestingTime: string;
    vestingDuration: 'month' | 'year' | 'week';
    includeCliff: false;
    includeCustomStart: false;
    cliffTime: string;
    cliffDuration: 'month' | 'year' | 'week';
    startDate: string;
  }[];
};

const vestingFactoryInterface = new Interface(vestingFactoryReadable);

export default function CreateGnosisVesting({ factory }: { factory: string }) {
  const { mutate: gnosisBatch, isLoading: gnosisLoading } = useGnosisBatch();
  const [tokenAddress, setTokenAddress] = React.useState<string>('');
  const provider = useProvider();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      vestingContracts: [
        {
          recipientAddress: '',
          vestedAmount: '',
          vestingTime: '',
          vestingDuration: 'year',
          includeCliff: false,
          includeCustomStart: false,
          cliffTime: '',
          cliffDuration: 'year',
          startDate: '',
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: 'vestingContracts',
    control,
  });
  async function onSubmit(data: FormValues) {
    const tokenContract = createERC20Contract({ tokenAddress: getAddress(tokenAddress), provider });
    const decimals = await tokenContract.decimals();
    const createCalls = [];
    let toApprove = new BigNumber(0);
    for (const i in data.vestingContracts) {
      const info = data.vestingContracts[i];
      const fmtVestingTime = new BigNumber(info.vestingTime).times(secondsByDuration[info.vestingDuration]).toFixed(0);
      const date = info.includeCustomStart ? new Date(info.startDate) : new Date(Date.now());
      if (date.toString() === 'Invalid Date') {
        toast.error('Invalid Date');
        return;
      }
      const startTime = new BigNumber(Number(date) / 1e3).toFixed(0);
      const fmtCliffTime = info.includeCliff
        ? new BigNumber(info.cliffTime).times(secondsByDuration[info.cliffDuration]).toFixed(0)
        : '0';
      const fmtVestingAmount = new BigNumber(info.vestedAmount).times(10 ** decimals).toFixed(0);
      const call = vestingFactoryInterface.encodeFunctionData('deploy_vesting_contract', [
        getAddress(tokenAddress),
        getAddress(info.recipientAddress),
        fmtVestingAmount,
        fmtVestingTime,
        startTime,
        fmtCliffTime,
      ]);
      createCalls.push(call);
      toApprove.plus(fmtVestingAmount).toFixed(0);
    }
    const calls = {
      tokenAddress: [ERC20Interface.encodeFunctionData('approve', [factory, toApprove])],
      factory: createCalls,
    };
    gnosisBatch({ calls: calls });
  }
  return (
    <form className="mx-auto flex max-w-xl flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Link href="/vesting">
        <a className="relative left-[-2px] flex items-center gap-2">
          <ArrowCircleLeftIcon className="h-6 w-6" />
          <span className="">Return</span>
        </a>
      </Link>
      <InputText
        handleChange={(e) => setTokenAddress(e.target.value)}
        label="Token Address"
        name="tokenAddress"
        isRequired
        placeholder="Token Address"
      />
      {fields.map((field, index) => {
        return (
          <section className="flex flex-col gap-4" key={field.id}>
            <label>
              <span className="input-label dark:text-white">{'Recipient Address'}</span>
              <input
                placeholder="Recipient Address"
                {...register(`vestingContracts.${index}.recipientAddress` as const, {
                  required: true,
                  pattern: /^0x[a-fA-F0-9]{40}$/,
                })}
                className="input-field dark:border-[#252525] dark:bg-[#202020] dark:text-white"
                autoComplete="off"
                autoCorrect="off"
                type="text"
                spellCheck="false"
              />
            </label>
            <label>
              <span className="input-label dark:text-white">{'Amount Vested'}</span>
              <input
                placeholder="0.0"
                {...register(`vestingContracts.${index}.vestedAmount` as const, {
                  required: true,
                  pattern: /[0-9.]/,
                })}
                className="input-field dark:border-[#252525] dark:bg-[#202020]"
                autoComplete="off"
                autoCorrect="off"
                type="text"
                spellCheck="false"
                inputMode="decimal"
              />
            </label>
            <label>
              <span className="input-label dark:text-white">{'Time Vested'}</span>
              <div className="relative flex">
                <input
                  placeholder="0.0"
                  {...register(`vestingContracts.${index}.vestingTime` as const, {
                    required: true,
                    pattern: /^[0-9]*[.,]?[0-9]*$/,
                  })}
                  className="input-field dark:border-[#252525] dark:bg-[#202020]"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  spellCheck="false"
                  inputMode="decimal"
                />
                <select
                  {...register(`vestingContracts.${index}.vestingDuration` as const, {
                    required: true,
                  })}
                  className="absolute right-1 bottom-1 top-2 my-auto flex w-full max-w-[24%] items-center truncate rounded border-0 bg-zinc-100 p-2 pr-4 text-sm shadow-sm dark:bg-stone-600"
                  style={{ backgroundSize: '1.25rem', backgroundPosition: 'calc(100% - 4px) 55%' }}
                >
                  <option value="week">{'week'}</option>
                  <option value="month">{'month'}</option>
                  <option value="year">{'year'}</option>
                </select>
              </div>
            </label>
            <div>
              <button
                type="button"
                className="w-fit rounded-[10px] border border-green-400 py-[6px] px-6 text-sm font-normal shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                style={{ marginRight: '0.6em' }}
                disabled={false}
                onClick={() =>
                  append({
                    recipientAddress: '',
                    vestedAmount: '',
                    vestingTime: '',
                    vestingDuration: 'year',
                    includeCliff: false,
                    includeCustomStart: false,
                    cliffTime: '',
                    cliffDuration: 'year',
                    startDate: '',
                  })
                }
              >
                Add another stream
              </button>
              {fields.length > 1 && (
                <button
                  type="button"
                  className="w-fit rounded-[10px] border border-red-400 py-[6px] px-6 text-sm font-normal shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={fields.length <= 1}
                  onClick={() => remove(index)}
                >
                  Delete
                </button>
              )}
            </div>
            <SubmitButton className="mt-5">{'Create Contracts'}</SubmitButton>
          </section>
        );
      })}
    </form>
  );
}
