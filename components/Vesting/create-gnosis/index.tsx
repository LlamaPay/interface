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
import { ERC20Interface } from 'utils/contract';
import { BeatLoader } from 'react-spinners';
import { Switch } from '@headlessui/react';
import { IVestingGnosisFormValues } from '../types';
import MultipleStreamChartWrapper from '../Charts/MultipleStreamChartWrapper';

const factoryAbi = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'deploy_vesting_contract',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'vesting_duration', type: 'uint256' },
      { name: 'vesting_start', type: 'uint256' },
      { name: 'cliff_length', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
];

const vestingFactoryInterface = new Interface(factoryAbi);

export default function CreateGnosisVesting({ factory }: { factory: string }) {
  const { mutate: gnosisBatch, isLoading: gnosisLoading } = useGnosisBatch();
  const [tokenAddress, setTokenAddress] = React.useState<string>('');
  const provider = useProvider();

  const { register, control, handleSubmit, getValues } = useForm<IVestingGnosisFormValues>({
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

  const { fields, append, remove, update } = useFieldArray({
    name: 'vestingContracts',
    control,
  });

  async function onSubmit(data: IVestingGnosisFormValues) {
    const tokenContract = createERC20Contract({ tokenAddress: getAddress(tokenAddress), provider });
    const decimals = await tokenContract.decimals();
    const createCalls: string[] = [];
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
      toApprove = toApprove.plus(fmtVestingAmount);
    }
    const calls: { [key: string]: string[] } = {};
    calls[tokenAddress] = [ERC20Interface.encodeFunctionData('approve', [factory, toApprove.toFixed(0)])];
    calls[factory] = createCalls;
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
                  pattern: /^[0-9]*[.,]?[0-9]*$/,
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
            {getValues(`vestingContracts.${index}.includeCliff`) ? (
              <label>
                <span className="input-label dark:text-white">{'Cliff Time'}</span>
                <div className="relative flex">
                  <input
                    placeholder="0.0"
                    {...register(`vestingContracts.${index}.cliffTime` as const, {
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
                    {...register(`vestingContracts.${index}.cliffDuration` as const, {
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
            ) : (
              ''
            )}
            {getValues(`vestingContracts.${index}.includeCustomStart`) ? (
              <label>
                <span className="input-label dark:text-white">{'Start Date'}</span>
                <input
                  placeholder="YYYY-MM-DD"
                  {...register(`vestingContracts.${index}.startDate` as const, {
                    pattern: /\d{4}-\d{2}-\d{2}/,
                  })}
                  className="input-field dark:border-[#252525] dark:bg-[#202020] dark:text-white"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  spellCheck="false"
                />
              </label>
            ) : (
              ''
            )}

            <div className="flex items-center gap-2">
              <span className="font-exo">{'Include Cliff'}</span>
              <Switch
                {...register(`vestingContracts.${index}.includeCliff` as const)}
                className={`${
                  getValues(`vestingContracts.${index}.includeCliff`) ? 'bg-[#23BD8F]' : 'bg-gray-200 dark:bg-[#252525]'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
                checked={getValues(`vestingContracts.${index}.includeCliff`)}
                onChange={(e: boolean) => {
                  update(index, {
                    ...getValues(`vestingContracts.${index}`),
                    includeCliff: e,
                  });
                }}
              >
                <span
                  className={`${
                    getValues(`vestingContracts.${index}.includeCliff`) ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white`}
                />
              </Switch>
              <span className="font-exo">{'Custom Start'}</span>
              <Switch
                {...register(`vestingContracts.${index}.includeCustomStart` as const)}
                className={`${
                  getValues(`vestingContracts.${index}.includeCustomStart`)
                    ? 'bg-[#23BD8F]'
                    : 'bg-gray-200 dark:bg-[#252525]'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
                checked={getValues(`vestingContracts.${index}.includeCustomStart`)}
                onChange={(e: boolean) => {
                  update(index, {
                    ...getValues(`vestingContracts.${index}`),
                    includeCustomStart: e,
                  });
                }}
              >
                <span
                  className={`${
                    getValues(`vestingContracts.${index}.includeCustomStart`) ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white`}
                />
              </Switch>
            </div>

            <MultipleStreamChartWrapper {...{ control, index }} />

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
          </section>
        );
      })}
      <SubmitButton disabled={gnosisLoading} className="mt-5">
        {gnosisLoading ? <BeatLoader size={6} color="white" /> : 'Create Contracts'}
      </SubmitButton>
    </form>
  );
}
