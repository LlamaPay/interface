import * as React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { useCreateStreamForm, useTokenList } from 'hooks';
import { InputAmountWithDuration, InputText, SelectToken, SubmitButton } from 'components/Form';
import { BeatLoader } from 'react-spinners';
import useTokenBalances, { ITokenBalance } from 'queries/useTokenBalances';
import AnimatedStream from 'components/AnimatedStream';
import { useTranslations } from 'next-intl';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

export default function CreateStreamField({
  setCreateStream,
}: {
  setCreateStream: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isLoading: listLoading } = useTokenList();

  const { data: tokens, isLoading: tokensLoading } = useTokenBalances();

  if (tokensLoading || listLoading) {
    return (
      <div className="mx-auto mt-12 px-7 sm:mt-[170px]">
        <div className="my-auto">
          <AnimatedStream />
        </div>
      </div>
    );
  }

  // TODO show no tokens placeholder
  if (!tokens) return null;

  return <Form tokens={tokens} setCreateStream={setCreateStream} />;
}

const Form = ({
  tokens,
  setCreateStream,
}: {
  tokens: ITokenBalance[];
  setCreateStream: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { tokenOptions, handleTokenChange, handleSubmit, confirmingStream } = useCreateStreamForm({
    tokens,
  });

  const t0 = useTranslations('Forms');
  const t1 = useTranslations('Onboard');

  return (
    <div className="mx-auto flex w-full flex-1 flex-col overflow-auto px-7 pt-12 pb-7">
      <form className="flex flex-1 flex-col gap-8" onSubmit={handleSubmit}>
        <InputText
          name="addressToStream"
          isRequired={true}
          label={t0('addressToStream')}
          placeholder={t0('recipientAddress')}
        />

        <span>
          <InputText
            name="shortName"
            isRequired={false}
            label={t0('associateName')}
            placeholder={t0('fastIdentification')}
            optional
          />
          <span className="mt-1 flex space-x-1">
            <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Names are only stored in the local storage of your device.
            </span>
          </span>
        </span>

        <span>
          <SelectToken
            handleTokenChange={handleTokenChange}
            tokens={tokenOptions}
            label={t0('selectTokenFromBalances')}
            tokenBalanceOf="lpContract"
          />
        </span>

        <span>
          <InputAmountWithDuration
            name="amountToStream"
            isRequired={true}
            label={t0('amountToStream')}
            selectInputName="streamDuration"
          />
          <span className="mt-1 flex space-x-1">
            <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Streams have an arbitrary duration and they can be cancelled at any time.
            </span>
          </span>
        </span>

        <SubmitButton disabled={confirmingStream}>
          {confirmingStream ? <BeatLoader size={6} color="white" /> : t0('createStream')}
        </SubmitButton>
      </form>

      <button
        className="form-submit-button mx-auto mt-7 flex w-full max-w-xs items-center justify-center gap-2 bg-white text-lp-primary dark:border-lp-secondary dark:bg-lp-primary dark:text-white"
        onClick={() => setCreateStream(false)}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span>{t1('depositToken')}</span>
      </button>
    </div>
  );
};
