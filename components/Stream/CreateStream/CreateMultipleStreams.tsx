import * as React from 'react';
import { ITokenBalance } from 'queries/useTokenBalances';
import { SelectToken, SubmitButton } from 'components/Form';
import { BeatLoader } from 'react-spinners';
import { useAddressStore } from 'store/address';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import useBatchCalls from 'queries/useBatchCalls';
import { LlamaContractInterface } from 'utils/contract';
import { getAddress } from 'ethers/lib/utils';
import BigNumber from 'bignumber.js';
import { secondsByDuration } from 'utils/constants';
import useStreamToken from 'queries/useStreamToken';
import { useTranslations } from 'next-intl';
import useGnosisBatch from 'queries/useGnosisBatch';

type FormValues = {
  streams: {
    addressToStream: string;
    shortName: string;
    tokenAddress: string;
    amountToStream: string;
    streamDuration: 'month' | 'year';
  }[];
};

interface ICall {
  [key: string]: string[];
}

const CreateMultipleStreams = ({ tokens }: { tokens: ITokenBalance[] }) => {
  const updateAddress = useAddressStore((state) => state.updateAddress);

  const tokenOptions = tokens.map((t) => t.tokenAddress);

  const { mutate: batchCall, isLoading: batchLoading } = useBatchCalls();
  const { mutate: streamToken, isLoading: createStreamLoading } = useStreamToken();
  const { mutate: gnosisBatch, isLoading: gnosisLoading } = useGnosisBatch();

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Forms');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      streams: [
        {
          addressToStream: '',
          shortName: '',
          tokenAddress: tokens[0]?.tokenAddress ?? '',
          amountToStream: '',
          streamDuration: 'month',
        },
      ],
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'streams',
    control,
  });

  const onSubmit = (data: FormValues) => {
    if (data.streams.length === 1) {
      const item = data.streams[0];
      if (item.shortName && item.shortName !== '') {
        updateAddress(item.addressToStream?.toLowerCase(), item.shortName);
      }

      const duration = item.streamDuration === 'year' ? 'year' : 'month';
      const tokenDetails = tokens.find((t) => t.tokenAddress?.toString() === item.tokenAddress?.toString()) ?? null;

      if (tokenDetails === null) return;

      const amountPerSec = new BigNumber(item.amountToStream).times(1e20).div(secondsByDuration[duration]).toFixed(0);

      streamToken({
        method: 'CREATE_STREAM',
        llamaContractAddress: tokenDetails.llamaContractAddress,
        payeeAddress: item.addressToStream,
        amountPerSec,
      });
    } else {
      const calls: ICall = data.streams.reduce((calls: ICall, item) => {
        if (item.shortName && item.shortName !== '') {
          updateAddress(item.addressToStream?.toLowerCase(), item.shortName);
        }

        const duration = item.streamDuration === 'year' ? 'year' : 'month';

        const tokenDetails = tokens.find((t) => t.tokenAddress?.toString() === item.tokenAddress?.toString()) ?? null;
        if (tokenDetails === null) return calls;
        // format amount to bignumber
        // convert amt to seconds
        const amountPerSec = new BigNumber(item.amountToStream).times(1e20).div(secondsByDuration[duration]).toFixed(0);
        const llamaContractAddress = tokenDetails.llamaContractAddress;

        const call = LlamaContractInterface.encodeFunctionData('createStream', [
          getAddress(item.addressToStream),
          amountPerSec,
        ]);

        const callData = calls[llamaContractAddress] ?? [];
        callData.push(call);

        return (calls = { ...calls, [llamaContractAddress]: callData });
      }, {});

      if (process.env.NEXT_PUBLIC_SAFE === 'true') {
        gnosisBatch({ calls: calls });
      } else {
        Object.keys(calls).map((p) => {
          batchCall({ llamaContractAddress: p, calls: calls[p] });
        });
      }
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => {
        return (
          <section className="flex flex-col gap-4" key={field.id}>
            {index > 0 && <hr className="mb-0 mt-2 border-dashed" />}

            <label>
              <span className="input-label">{t1('addressToStream')}</span>
              <input
                placeholder={t1('recipientAddress')}
                {...register(`streams.${index}.addressToStream` as const, {
                  required: true,
                  pattern: /^0x[a-fA-F0-9]{40}$/,
                })}
                className="input-field"
                autoComplete="off"
                autoCorrect="off"
                type="text"
                spellCheck="false"
              />
              {errors?.streams?.[index]?.addressToStream?.type === 'required' && (
                <p className="mt-1 text-xs text-red-500">{t1('requiredField')}</p>
              )}
              {errors?.streams?.[index]?.addressToStream?.type === 'pattern' && (
                <p className="mt-1 text-xs text-red-500">{t1('validAddress')}</p>
              )}
            </label>

            <label>
              <span className="input-label">
                <span>{t1('associateName')}</span>
                <small className="mx-2 text-neutral-500">{`(${t1('optional')})`}</small>
              </span>
              <input
                placeholder={t1('fastIdentification')}
                {...register(`streams.${index}.shortName` as const)}
                className="input-field"
                autoComplete="off"
                autoCorrect="off"
                type="text"
                spellCheck="false"
              />
            </label>

            <span>
              <Controller
                name={`streams.${index}.tokenAddress`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <SelectToken
                    handleTokenChange={field.onChange}
                    tokens={tokenOptions}
                    className="border border-neutral-300 bg-transparent py-[3px] shadow-none dark:border-neutral-700 dark:bg-stone-800"
                    label={t1('selectTokenFromBalances')}
                    {...field}
                  />
                )}
              />
            </span>

            <div>
              <div>
                <label htmlFor={`stream-amount-${index}`} className="input-label">
                  {t1('amountToStream')}
                </label>
                <div className="relative flex">
                  <input
                    placeholder="0.0"
                    {...register(`streams.${index}.amountToStream` as const, {
                      required: true,
                      pattern: /^[0-9]*[.,]?[0-9]*$/,
                    })}
                    className="input-field"
                    autoComplete="off"
                    autoCorrect="off"
                    type="text"
                    spellCheck="false"
                    inputMode="decimal"
                  />

                  <label {...register(`streams.${index}.streamDuration` as const)} className="sr-only">
                    {t1('streamDuration')}
                  </label>
                  <select
                    {...register(`streams.${index}.streamDuration` as const, {
                      required: true,
                    })}
                    className="absolute right-1 bottom-1 top-2 my-auto flex w-full max-w-[24%] items-center truncate rounded border-0 bg-zinc-100 p-2 pr-4 text-sm shadow-sm dark:bg-stone-600"
                    style={{ backgroundSize: '1.25rem', backgroundPosition: 'calc(100% - 4px) 55%' }}
                  >
                    <option value="month">{t0('month')}</option>
                    <option value="year">{t0('year')}</option>
                  </select>
                </div>
              </div>
              {errors?.streams?.[index]?.amountToStream?.type === 'required' && (
                <p className="mt-1 text-xs text-red-500">{t1('requiredField')}</p>
              )}
              {errors?.streams?.[index]?.amountToStream?.type === 'pattern' && (
                <p className="mt-1 text-xs text-red-500">{t1('validNumber')}</p>
              )}
            </div>

            <button
              type="button"
              className="w-fit rounded-[10px] border border-red-400 py-[6px] px-6 text-sm font-normal shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              disabled={fields.length <= 1}
              onClick={() => remove(index)}
            >
              {t1('delete')}
            </button>
          </section>
        );
      })}

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="form-submit-button flex-1 rounded-[10px] bg-white text-[#23BD8F]"
          disabled={false}
          onClick={() =>
            append({
              addressToStream: '',
              shortName: '',
              tokenAddress: tokens[0]?.tokenAddress ?? '',
              amountToStream: '',
              streamDuration: 'month',
            })
          }
        >
          {t1('addAnotherStream')}
        </button>

        <SubmitButton className="flex-1" disabled={createStreamLoading || batchLoading || gnosisLoading}>
          {createStreamLoading || batchLoading ? <BeatLoader size={6} color="white" /> : t1('confirmStreams')}
        </SubmitButton>
      </div>
    </form>
  );
};

export default CreateMultipleStreams;
