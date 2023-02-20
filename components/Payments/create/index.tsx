import { ArrowLeftCircleIcon } from '@heroicons/react/24/solid';
import { getAddress, Interface, isAddress } from 'ethers/lib/utils';
import { useNetworkProvider } from '~/hooks';
import Link from 'next/link';
import { useApproveToken, useCheckMultipleTokenApproval } from '~/queries/useTokenApproval';
import { useFieldArray, useForm } from 'react-hook-form';
import { createERC20Contract, ICheckMultipleTokenAllowance } from '~/utils/tokenUtils';
import BigNumber from 'bignumber.js';
import { paymentsContractABI } from '~/lib/abis/paymentsContract';
import { useAccount, useContractWrite, useSigner } from 'wagmi';
import toast from 'react-hot-toast';
import { SubmitButton } from '~/components/Form';
import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useGnosisBatch from '~/queries/useGnosisBatch';
import { networkDetails } from '~/lib/networkDetails';
import { ERC20Interface } from '~/utils/contract';
import { BeatLoader } from 'react-spinners';

interface IPaymentFormValues {
  payments: {
    token: string;
    payee: string;
    amount: string;
    release: string;
  }[];
}

interface ICall {
  token: string;
  payee: string;
  amount: string;
  release: string;
}

const contractInterface = new Interface(paymentsContractABI);

export default function CreatePayment({ contract }: { contract: string }) {
  const { register, control, handleSubmit, reset, getValues, setValue } = useForm<IPaymentFormValues>({
    defaultValues: {
      payments: [
        {
          token: '',
          payee: '',
          amount: '',
          release: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'payments',
    control,
  });

  const { provider, chainId } = useNetworkProvider();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { mutate: checkApproval, data: approvalData, isLoading: checkingApproval } = useCheckMultipleTokenApproval();
  const { mutate: gnosisBatch } = useGnosisBatch();
  const { mutate: approveToken, isLoading: approving } = useApproveToken();
  const [csvFile, setCsvFile] = React.useState<File | null>(null);
  const queryClient = useQueryClient();

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
          token: columns[0],
          payee: columns[1],
          amount: columns[2],
          release: columns[3],
        });
      }
      remove(0);
    };
    reader.readAsText(csvFile);
  }

  const { writeAsync: batch } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contract as `0x${string}`,
    abi: paymentsContractABI,
    functionName: 'batch',
  });

  async function onChange(index: number, eventType: string, value: string) {
    if (process.env.NEXT_PUBLIC_SAFE === 'true') return;
    if (!chainId) return;
    if (!provider) return;
    if (eventType === 'amount') {
      setValue(`payments.${index}.amount`, value);
    } else if (eventType === 'token') {
      setValue(`payments.${index}.token`, value);
    }
    const decimals: { [key: string]: number } = {};
    const tokenAndAmount: { [key: string]: string } = {};
    for (let i = 0; i < fields.length; i++) {
      const token = getValues(`payments.${i}.token`).toLowerCase();
      const amount = getValues(`payments.${i}.amount`);
      if (!isAddress(token)) continue;
      if (!decimals[token]) {
        decimals[token] = await createERC20Contract({ tokenAddress: getAddress(token), provider }).decimals();
      }
      if (!tokenAndAmount[token]) {
        tokenAndAmount[token] = BigNumber(amount)
          .times(10 ** decimals[token])
          .toFixed(0);
      } else {
        tokenAndAmount[token] = BigNumber(tokenAndAmount[token])
          .plus(BigNumber(amount).times(10 ** decimals[token]))
          .toFixed(0);
      }
      const toCheck: ICheckMultipleTokenAllowance = {
        userAddress: address,
        tokens: {},
      };
      for (const token in tokenAndAmount) {
        toCheck.tokens[token] = {
          token: createERC20Contract({ tokenAddress: getAddress(token), provider }),
          approvedForAmount: tokenAndAmount[token],
          approveForAddress: networkDetails[chainId].paymentsContract,
        };
      }
      checkApproval(toCheck);
    }
  }

  async function onSubmit(data: IPaymentFormValues) {
    if (!provider) return;
    if (!chainId) return;
    if (!networkDetails[chainId].paymentsContract) return;
    if (!signer) return;
    const decimals: { [key: string]: number } = {};
    const tokenAndAmount: { [key: string]: string } = {};
    const convertedCalls: ICall[] = [];
    const calls: string[] = [];
    try {
      for (let i = 0; i < data.payments.length; i++) {
        const token = getValues(`payments.${i}.token`).toLocaleLowerCase();
        const payee = getValues(`payments.${i}.payee`);
        const amount = getValues(`payments.${i}.amount`);
        const release = getValues(`payments.${i}.release`);
        if (!decimals[token]) {
          decimals[token] = await createERC20Contract({ tokenAddress: getAddress(token), provider }).decimals();
        }
        if (!tokenAndAmount[token]) {
          tokenAndAmount[token] = BigNumber(amount)
            .times(10 ** decimals[token])
            .toFixed(0);
        } else {
          tokenAndAmount[token] = BigNumber(tokenAndAmount[token])
            .plus(BigNumber(amount).times(10 ** decimals[token]))
            .toFixed(0);
        }
        convertedCalls.push({
          token: getAddress(token),
          payee: getAddress(payee),
          amount: BigNumber(amount)
            .times(10 ** decimals[token])
            .toFixed(0),
          release: (new Date(`${release} 00:00`).getTime() / 1e3).toFixed(0),
        });
      }
      if (process.env.NEXT_PUBLIC_SAFE === 'false') {
        const toCheck: ICheckMultipleTokenAllowance = {
          userAddress: address,
          tokens: {},
        };
        for (const token in tokenAndAmount) {
          toCheck.tokens[token] = {
            token: createERC20Contract({ tokenAddress: getAddress(token), provider }),
            approvedForAmount: tokenAndAmount[token],
            approveForAddress: networkDetails[chainId].paymentsContract,
          };
        }
        checkApproval(toCheck);
        if (!approvalData || !approvalData.allApproved) {
          Object.keys(toCheck.tokens).map((p) => {
            const token = toCheck.tokens[p];
            if (token.approveForAddress && token.approvedForAmount) {
              approveToken(
                {
                  amountToApprove: token.approvedForAmount,
                  spenderAddress: token.approveForAddress,
                  tokenAddress: p,
                },
                {
                  onSettled: () => {
                    checkApproval(toCheck);
                  },
                }
              );
            }
          });
          checkApproval(toCheck);
        } else {
          convertedCalls.forEach((c) => {
            calls.push(contractInterface.encodeFunctionData('create', [c.token, c.payee, c.amount, c.release]));
          });
          batch({ recklesslySetUnpreparedArgs: [calls, true] })
            .then((data) => {
              const toastid = toast.loading('Creating');
              data.wait().then((receipt) => {
                toast.dismiss(toastid);
                receipt.status === 1 ? toast.success('Successfully Created') : toast.error('Failed to Create');
              });
              checkApproval(toCheck);
              queryClient.invalidateQueries();
            })
            .catch((err) => {
              toast.error(err.message);
            });
        }
      } else {
        const call: { [key: string]: string[] } = {};
        for (const token in tokenAndAmount) {
          call[token] = [
            ERC20Interface.encodeFunctionData('approve', [
              getAddress(networkDetails[chainId].paymentsContract as string),
              tokenAndAmount[token],
            ]),
          ];
        }
        convertedCalls.forEach((c) => {
          calls.push(contractInterface.encodeFunctionData('create', [c.token, c.payee, c.amount, c.release]));
        });
        call[networkDetails[chainId].paymentsContract as string] = calls;
        gnosisBatch({ calls: call });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="space-y-2">
        <Link href="/payments" className="relative left-[-2px] flex items-center gap-2">
          <ArrowLeftCircleIcon className="h-6 w-6" />
          <span className="">Return</span>
        </Link>
        <form className="py-3 text-center">
          <input type="file" accept=".csv" onChange={(e) => handleFileChange(e)} />
          <button
            className="rounded-3xl border px-3 py-[6px] text-sm dark:border-[#252525] dark:bg-[#252525]"
            onClick={(e) => importCSV(e)}
          >
            Import
          </button>
        </form>
      </div>
      <form className="mx-auto flex max-w-xl flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => {
          return (
            <section className="flex flex-col gap-4" key={field.id}>
              <label>
                <span className="input-label dark:text-white">{'Token Address (ERC-20 only)'}</span>
                <input
                  placeholder="Token Address"
                  {...register(`payments.${index}.token` as const, {
                    required: true,
                    pattern: /^0x[a-fA-F0-9]{40}$/,
                  })}
                  className="input-field dark:border-[#252525] dark:bg-[#202020] dark:text-white"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  spellCheck="false"
                  onChange={(e) => onChange(index, 'token', e.target.value)}
                />
              </label>
              <label>
                <span className="input-label dark:text-white">{'Payee Address'}</span>
                <input
                  placeholder="Payee Address"
                  {...register(`payments.${index}.payee` as const, {
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
                <span className="input-label dark:text-white">{'Amount To Send'}</span>
                <input
                  placeholder="0.0"
                  {...register(`payments.${index}.amount` as const, {
                    required: true,
                    pattern: /^[0-9]*[.,]?[0-9]*$/,
                  })}
                  className="input-field dark:border-[#252525] dark:bg-[#202020]"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  spellCheck="false"
                  inputMode="decimal"
                  onChange={(e) => onChange(index, 'amount', e.target.value)}
                />
              </label>
              <label>
                <span className="input-label dark:text-white">{'Date To Release'}</span>
                <input
                  placeholder="YYYY-MM-DD"
                  {...register(`payments.${index}.release` as const, {
                    pattern: /\d{4}-\d{2}-\d{2}/,
                  })}
                  className="input-field dark:border-[#252525] dark:bg-[#202020] dark:text-white"
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  spellCheck="false"
                />
              </label>
              <div>
                <button
                  type="button"
                  className="w-fit rounded-[10px] border border-green-400 py-[6px] px-6 text-sm font-normal shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ marginRight: '0.6em' }}
                  disabled={false}
                  onClick={() =>
                    append({
                      token: '',
                      payee: '',
                      amount: '',
                      release: '',
                    })
                  }
                >
                  Add
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
        <SubmitButton className="mt-5" disabled={!chainId || !networkDetails[chainId].paymentsContract}>
          {!chainId ? (
            'Connect Wallet'
          ) : !networkDetails[chainId].paymentsContract ? (
            'Chain not supported'
          ) : approving || checkingApproval ? (
            <BeatLoader size={6} color="white" />
          ) : process.env.NEXT_PUBLIC_SAFE === 'true' ? (
            'Create'
          ) : approvalData?.allApproved ? (
            'Create'
          ) : (
            'Approve'
          )}
        </SubmitButton>
      </form>
    </>
  );
}
