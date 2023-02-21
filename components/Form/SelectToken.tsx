import * as React from 'react';
import { Select, SelectArrow, SelectItem, SelectLabel, useSelectState } from 'ariakit/select';
import { Dialog, DialogDismiss, DialogHeading, useDialogState } from 'ariakit/dialog';
import { Combobox, ComboboxItem, ComboboxList, useComboboxState } from 'ariakit/combobox';
import classNames from 'classnames';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { InputText } from './Input';
import { SubmitButton } from './Button';
import useCreateLlamaPayContract from '~/queries/useCreateLlamaPayContract';
import { BeatLoader } from '~/components/BeatLoader';
import useTokenBalances from '~/queries/useTokenBalances';
import Image from 'next/image';
import defaultImage from '~/public/empty-token.webp';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { TokenBalance } from '~/components/Balance/BalanceAndSymbol';

interface ISelectTokenProps {
  handleTokenChange: (token: string) => void;
  tokens: string[];
  label?: string;
  className?: string;
  tokenBalanceOf: 'none' | 'wallet' | 'lpContract';
}

function Token({
  value,
  shortName,
  tokenBalanceOf,
}: {
  value: string;
  shortName?: boolean;
  tokenBalanceOf?: 'none' | 'wallet' | 'lpContract';
}) {
  const { data: tokens } = useTokenBalances();

  const data = React.useMemo(() => {
    if (tokenBalanceOf === 'lpContract') {
      return tokens ? tokens.find((t) => t.tokenAddress === value) : null;
    }

    return tokens ? tokens.find((t) => t.tokenAddress === value) : null;
  }, [value, tokens, tokenBalanceOf]);

  const t = useTranslations('Common');

  return (
    <div
      className={classNames(
        'flex flex-1 flex-row items-center justify-between',
        shortName ? 'truncate py-[5px]' : 'balance-wrap p-2'
      )}
      id="token-render-value"
    >
      <div className="flex items-center space-x-2 overflow-x-hidden">
        <div className="flex h-7 w-7 flex-shrink-0 items-center rounded-full">
          {data ? (
            <Image src={data.logoURI} alt={t('logoAlt', { name: data.name })} width={24} height={24} />
          ) : (
            <Image src={defaultImage} width={24} height={24} alt={t('logoAlt', { name: 'fallback token' })} />
          )}
        </div>
        {data ? (
          <div className="truncate">{shortName ? data.symbol : data.name}</div>
        ) : (
          <div className="truncate">{value}</div>
        )}
      </div>
      <div className="ml-4 whitespace-nowrap slashed-zero text-gray-600 dark:text-gray-400">
        {tokenBalanceOf === 'none' ? null : tokenBalanceOf === 'lpContract' ? (
          <TokenBalance address={value} symbol={data?.symbol ?? ''} />
        ) : (
          <> {data?.balance && `${data.balance} ${data?.symbol}`}</>
        )}
      </div>{' '}
    </div>
  );
}

export const SelectToken = React.forwardRef<HTMLButtonElement, ISelectTokenProps>(function S(
  { handleTokenChange, tokens, label, className, tokenBalanceOf },
  ref
) {
  const [newTokenForm, setNewTokenForm] = React.useState(false);
  const combobox = useComboboxState({ list: tokens });
  // value and setValue shouldn't be passed to the select state because the
  // select value and the combobox value are different things.
  const { value, setValue, ...selectProps } = combobox;
  const select = useSelectState({ ...selectProps, defaultValue: tokens[0] });

  // Resets combobox value when popover is collapsed
  if (!select.mounted && combobox.value) {
    combobox.setValue('');
    setNewTokenForm(false);
  }

  const dialog = useDialogState();

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Forms');

  return (
    <>
      <SelectLabel state={select} className={classNames('input-label dark:text-white', !label && 'sr-only')}>
        {label || t1('selectToken')}
      </SelectLabel>
      <Select
        state={select}
        className={classNames('input-field flex w-full items-center !py-[0px]', className)}
        onClick={() => {
          dialog.toggle();
          combobox.setOpen(true);
        }}
        ref={ref}
      >
        {<Token value={select.value} shortName tokenBalanceOf="none" />}
        <SelectArrow className="relative right-[-2px]" />
      </Select>

      <Dialog state={dialog} className="dialog h-full">
        {newTokenForm ? (
          <NewTokenForm setNewTokenForm={setNewTokenForm} />
        ) : (
          <>
            <header className="relative mt-3 flex items-center justify-between">
              <DialogHeading className="px-4">{t1('selectToken')}</DialogHeading>
              <DialogDismiss className="absolute right-3 flex items-start justify-end">
                <span className="sr-only">{t0('close')}</span>
                <XMarkIcon className="h-6 w-6" />
              </DialogDismiss>
            </header>
            <Combobox
              state={combobox}
              autoSelect
              placeholder={t1('searchNameOrAddress')}
              className="input-field m-4 w-[revert]"
            />
            <ComboboxList state={combobox} className="m-4 mt-0 cursor-pointer list-none overflow-auto">
              {combobox.matches.map((token) => (
                <ComboboxItem
                  key={token}
                  focusOnHover
                  className="scroll-mt-0 rounded active-item:bg-neutral-100 dark:active-item:bg-neutral-600"
                  onClick={() => {
                    select.setValue(token);
                    handleTokenChange(token);
                    dialog.toggle();
                    select.toggle();
                  }}
                >
                  {(props) => (
                    <SelectItem {...props}>
                      <Token value={token} tokenBalanceOf={tokenBalanceOf} />
                    </SelectItem>
                  )}
                </ComboboxItem>
              ))}
            </ComboboxList>
            <button
              className="nav-button m-4 mt-auto flex items-center justify-center gap-2"
              onClick={() => setNewTokenForm(true)}
            >
              <span>{t1('orAddANewToken')}</span>
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </>
        )}
      </Dialog>
    </>
  );
});

const NewTokenForm = ({ setNewTokenForm }: { setNewTokenForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { mutate, isLoading, error } = useCreateLlamaPayContract();

  const [isConfirming, setIsConfirming] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const queryClient = useQueryClient();

  // TODO make sure this submit handler doesn't mess up DepositField submit handler like error field or loading states, as this is triggering that component forms submit func
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsError(false);

    const form = e.target as HTMLFormElement & { tokenAddress: { value: string } };
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
          <XMarkIcon className="h-6 w-6" />
        </DialogDismiss>
      </header>
      <form className="m-4 mt-[10%]" onSubmit={handleSubmit}>
        <InputText name="tokenAddress" isRequired={true} label={t1('tokenAddress')} placeholder="0x..." />
        <SubmitButton className="!mt-4 rounded" disabled={isLoading}>
          {isLoading ? (
            <BeatLoader size="6px" color="white" />
          ) : isConfirming ? (
            <span className="flex items-center justify-center space-x-2">
              <BeatLoader size="6px" color="white" />
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
