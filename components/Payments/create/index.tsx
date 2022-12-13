import { ArrowCircleLeftIcon } from '@heroicons/react/solid';
import { getAddress, Interface } from 'ethers/lib/utils';
import { useNetworkProvider } from 'hooks';
import Link from 'next/link';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { useFieldArray, useForm } from 'react-hook-form';
import { createERC20Contract } from 'utils/tokenUtils';
import BigNumber from 'bignumber.js';
import paymentsContract from 'abis/paymentsContract';
import { useAccount, useContractWrite } from 'wagmi';
import toast from 'react-hot-toast';
import { SubmitButton } from 'components/Form';
import React from 'react';
import { Contract } from 'ethers';
import { useQueryClient } from 'react-query';
import useGnosisBatch from 'queries/useGnosisBatch';
import { networkDetails } from 'utils/constants';

interface IPaymentFormValues {
  payments: {
    token: string;
    payee: string;
    amount: string;
    release: string;
  }[];
}

interface ITokenInfo {
  [key: string]: {
    tokenContract: Contract;
    toApprove: number;
    decimals: number;
  };
}

const contractInterface = new Interface(paymentsContract);

export default function CreatePayment({ contract }: { contract: string }) {
  const { register, control, handleSubmit, reset } = useForm<IPaymentFormValues>({
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
  const [{ data: accountData }] = useAccount();
  const { mutate: approveToken } = useApproveToken();
  const [approved, setApproved] = React.useState<boolean>(true);
  const { mutate: gnosisBatch } = useGnosisBatch();
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

  const [{}, batch] = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: paymentsContract,
    },
    'batch'
  );

  async function onSubmit(data: IPaymentFormValues) {
    if (!provider) return;
    const batchCall: string[] = [];
    const tokenInfo: ITokenInfo = {};
    try {
      for (const i in data.payments) {
        const payment = data.payments[i];
        const token = payment.token.toLowerCase();
        if (!tokenInfo[token]) {
          const tokenContract = createERC20Contract({ tokenAddress: getAddress(token), provider });
          tokenInfo[token] = {
            tokenContract: tokenContract,
            toApprove: Number(payment.amount),
            decimals: await tokenContract.decimals(),
          };
        } else {
          tokenInfo[token].toApprove += Number(payment.amount);
        }
      }

      if (process.env.NEXT_PUBLIC_SAFE === 'false') {
        let allApproved = true;
        for (const token in tokenInfo) {
          const info = tokenInfo[token];
          const approveFor = new BigNumber(info.toApprove).times(10 ** info.decimals).toFixed(0);
          const isApproved = (await info.tokenContract.allowance(accountData?.address, contract)).gte(approveFor);
          if (!isApproved) {
            approveToken({
              tokenAddress: getAddress(token),
              amountToApprove: approveFor,
              spenderAddress: contract,
            });
            allApproved = false;
          }
        }
        if (!allApproved) return;
        data.payments.forEach((payment) => {
          const token = payment.token.toLowerCase();
          const call = contractInterface.encodeFunctionData('create', [
            getAddress(token),
            getAddress(payment.payee),
            new BigNumber(payment.amount).times(10 ** tokenInfo[token].decimals).toFixed(0),
            new Date(payment.release).getTime() / 1e3,
          ]);
          batchCall.push(call);
        });

        batch({ args: [batchCall, true] }).then((data) => {
          if (data.error) {
            toast.error(data.error.message);
          } else {
            const toastid = toast.loading('Creating');
            data.data.wait().then((receipt) => {
              toast.dismiss(toastid);
              receipt.status === 1 ? toast.success('Successfully Created') : toast.error('Failed to Create');
            });
          }
          queryClient.invalidateQueries();
        });
      } else {
        const call: { [key: string]: string[] } = {};
        if (!chainId || !networkDetails[chainId!].paymentsContract) return;
        for (const token in tokenInfo) {
          const info = tokenInfo[token];
          const tokenInterface = info.tokenContract.interface;
          const approveFor = new BigNumber(info.toApprove).times(10 ** info.decimals).toFixed(0);
          call[token] = [
            tokenInterface.encodeFunctionData('approve', [
              getAddress(networkDetails[chainId].paymentsContract!),
              approveFor,
            ]),
          ];
        }
        data.payments.forEach((payment) => {
          const token = payment.token.toLowerCase();
          const call = contractInterface.encodeFunctionData('create', [
            getAddress(token),
            getAddress(payment.payee),
            new BigNumber(payment.amount).times(10 ** tokenInfo[token].decimals).toFixed(0),
            new Date(payment.release).getTime() / 1e3,
          ]);
          batchCall.push(call);
        });
        call[networkDetails[chainId].paymentsContract!] = batchCall;
        gnosisBatch({ calls: call });
      }
    } catch (error: any) {
      toast.error(error);
    }
  }

  return (
    <>
      <div className="max-w-xl space-y-2">
        <Link href="/payments">
          <a className="relative left-[-2px] flex items-center gap-2">
            <ArrowCircleLeftIcon className="h-6 w-6" />
            <span className="">Return</span>
          </a>
        </Link>
        <form>
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
                <span className="input-label dark:text-white">{'Token Address'}</span>
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
                <span className="input-label dark:text-white">{'Amount Vested'}</span>
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
                />
              </label>
              <label>
                <span className="input-label dark:text-white">{'Date'}</span>
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
        <SubmitButton className="mt-5">
          {process.env.NEXT_PUBLIC_SAFE === 'true' ? 'Create' : approved ? 'Create' : 'Approve'}
        </SubmitButton>
      </form>
    </>
  );
}
