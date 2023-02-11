import * as React from 'react';
import { InputText, SubmitButton } from '~/components/Form';
import Link from 'next/link';
import useGnosisBatch from '~/queries/useGnosisBatch';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import { useFieldArray, useForm } from 'react-hook-form';
import BigNumber from 'bignumber.js';
import { secondsByDuration } from '~/utils/constants';
import toast from 'react-hot-toast';
import { createERC20Contract } from '~/utils/tokenUtils';
import { getAddress, Interface } from 'ethers/lib/utils';
import { useProvider } from 'wagmi';
import { ERC20Interface } from '~/utils/contract';
import { BeatLoader } from 'react-spinners';
import { Switch } from '@headlessui/react';
import type { IVestingGnosisFormValues } from '../types';
import MultipleStreamChartWrapper from '../Charts/MultipleStreamChartWrapper';
import { useQueryClient } from '@tanstack/react-query';
import EOAWarning from '../create/EOAWarning';
import { useDialogState } from 'ariakit';

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
  const [csvFile, setCsvFile] = React.useState<File | null>(null);
  const [notEOAArr, setNotEAArr] = React.useState<(string | null)[]>([]);
  const eoaWarningDialog = useDialogState();
  const provider = useProvider();
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, getValues, reset } = useForm<IVestingGnosisFormValues>({
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
    const notEOAs: string[] = [];
    let toApprove = new BigNumber(0);
    for (const i in data.vestingContracts) {
      const info = data.vestingContracts[i];
      const fmtVestingTime = new BigNumber(info.vestingTime).times(secondsByDuration[info.vestingDuration]).toFixed(0);
      const date = info.includeCustomStart ? new Date(info.startDate) : new Date(Date.now());
      const isEOA = (await provider.getCode(info.recipientAddress)) === '0x';
      if (!isEOA) {
        notEOAs.push(info.recipientAddress);
      }
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
    if (notEOAs.length > 0) {
      setNotEAArr(notEOAs);
    }
    const calls: { [key: string]: string[] } = {};
    calls[tokenAddress] = [ERC20Interface.encodeFunctionData('approve', [factory, toApprove.toFixed(0)])];
    calls[factory] = createCalls;
    gnosisBatch({ calls: calls });
    queryClient.invalidateQueries();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setCsvFile(e.target.files[0]);
  }

  async function importCSV(e: any) {
    e.preventDefault();
    if (!csvFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || !e.target.result) return;
      reset();
      const rows = e.target.result?.toString().split('\n');
      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',');
        append({
          recipientAddress: columns[0],
          vestedAmount: columns[1],
          vestingTime: columns[2],
          vestingDuration: 'month',
          includeCliff: Number(columns[3]) > 0 ? true : false,
          includeCustomStart: columns[4] != '' ? true : false,
          cliffTime: columns[3],
          cliffDuration: 'month',
          startDate: columns[4],
        });
      }
      remove(0);
    };
    reader.readAsText(csvFile);
  }

  return (
    <>
      <div className="max-w-xl space-y-2">
        <Link href="/vesting" className="relative left-[-2px] flex items-center gap-2">
          <ArrowLeftCircleIcon className="h-6 w-6" />
          <span className="">Return</span>
        </Link>
        <form>
          <input type="file" accept=".csv" onChange={(e) => handleFileChange(e)} />
          <button className="row-action-links" onClick={(e) => importCSV(e)}>
            Import
          </button>
        </form>
      </div>
      <form className="mx-auto flex max-w-xl flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
                    getValues(`vestingContracts.${index}.includeCliff`)
                      ? 'bg-lp-primary'
                      : 'bg-gray-200 dark:bg-[#252525]'
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
                      ? 'bg-lp-primary'
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
      <EOAWarning address={notEOAArr} dialog={eoaWarningDialog} />
    </>
  );
}
