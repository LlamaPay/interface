import * as React from 'react';
import { DialogDismiss, DialogHeading } from 'ariakit/dialog';
import { XIcon, ArrowLeftIcon } from '@heroicons/react/solid';
import { InputText } from '../Input';
import { SubmitButton } from '../Button';
import useCreateLlamaPayContract from 'queries/useCreateLlamaPayContract';
import { BeatLoader } from 'react-spinners';
import { useQueryClient } from 'react-query';
import { useTranslations } from 'next-intl';

export const CreateNewToken = ({
  setNewTokenForm,
}: {
  setNewTokenForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { mutate, isLoading, error } = useCreateLlamaPayContract();

  const [isConfirming, setIsConfirming] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const queryClient = useQueryClient();

  // TODO make sure this submit handler doesn't mess up DepositField submit handler like error field or loading states, as this is triggering that component forms submit func
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsError(false);

    const form = e.target as typeof e.target & { tokenAddress: { value: string } };
    const tokenAddress = form.tokenAddress?.value;
    mutate(
      { tokenAddress },
      {
        onSuccess: (res) => {
          setIsConfirming(true);

          res.wait().then((data) => {
            queryClient.invalidateQueries();

            if (data.status === 1) {
              setNewTokenForm(false);
            } else {
              setIsError(true);
            }
            setIsConfirming(false);
          });
        },
      }
    );
  };

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Forms');

  return (
    <>
      <header className="relative m-4 mt-3 flex items-center justify-between">
        <DialogHeading className="px-4">
          <button className="absolute left-0" onClick={() => setNewTokenForm(false)}>
            <span className="sr-only">{t0('goBack')}</span>
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        </DialogHeading>
        <DialogDismiss className="absolute right-[-4px] top-0 flex items-start justify-end">
          <span className="sr-only">{t0('close')}</span>
          <XIcon className="h-6 w-6" />
        </DialogDismiss>
      </header>
      <form className="m-4 mt-[10%]" onSubmit={handleSubmit}>
        <InputText name="tokenAddress" isRequired={true} label={t1('tokenAddress')} />
        <SubmitButton className="!mt-4 rounded" disabled={isLoading}>
          {isLoading ? (
            <BeatLoader size={6} color="white" />
          ) : isConfirming ? (
            <span className="flex items-center justify-center space-x-2">
              <BeatLoader size={6} color="white" />
            </span>
          ) : (
            t1('addToken')
          )}
        </SubmitButton>
      </form>
      <small className="m-4 text-center text-red-500">
        {isError ? "Couldn't add token" : error ? error.message : null}
      </small>
    </>
  );
};
