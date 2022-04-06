import * as React from 'react';
import { Select, SelectArrow, SelectItem, SelectLabel, useSelectState } from 'ariakit/select';
import { Dialog, DialogDismiss, DialogHeading, useDialogState } from 'ariakit/dialog';
import { Combobox, ComboboxItem, ComboboxList, useComboboxState } from 'ariakit/combobox';
import classNames from 'classnames';
import { XIcon, ArrowLeftIcon } from '@heroicons/react/solid';
import useGetAllTokens from 'queries/useGetAllTokens';
import { InputText } from './Input';
import { SubmitButton } from './Button';
import useCreateLlamaPayContract from 'queries/useCreateLlamaPayContract';

interface ISelectTokenProps {
  handleTokenChange: (token: string) => void;
  tokens: string[];
  label?: string;
  className?: string;
}

function Token({ value, shortName }: { value: string; shortName?: boolean }) {
  const { data: tokens } = useGetAllTokens();

  const data = React.useMemo(() => {
    return tokens?.find((t) => t.name === value || t.tokenAddress === value);
  }, [value, tokens]);

  // TODO show token image and symbol for verified lists, else show token address
  return (
    <div className="flex flex-1 items-center space-x-2 overflow-x-hidden py-2 pr-1">
      <div className="h-6 w-6 flex-shrink-0 rounded-full bg-orange-400"></div>
      {data ? (
        <div className="truncate">{shortName ? data.symbol : `${data.name} (${data.symbol})`}</div>
      ) : (
        <div className="truncate">{value}</div>
      )}
    </div>
  );
}

export function SelectToken({ handleTokenChange, tokens, label, className }: ISelectTokenProps) {
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

  return (
    <>
      <SelectLabel state={select} className={classNames(!label && 'sr-only')}>
        {label || 'Select token'}
      </SelectLabel>
      <Select
        state={select}
        className={classNames(
          'flex w-full items-center rounded bg-zinc-100 p-2 shadow-sm dark:bg-stone-600',
          className
        )}
        onClick={dialog.toggle}
      >
        {<Token value={select.value} shortName />}
        <SelectArrow className="relative right-[-2px]" />
      </Select>

      {/* use select state as dialog state so that combobox options are displayed */}
      <Dialog
        state={select}
        className="absolute top-8 left-4 right-4 bottom-8 z-50 m-auto mx-auto mt-auto flex max-h-[80vh] max-w-lg flex-col overflow-auto rounded bg-zinc-100 drop-shadow-lg  dark:bg-zinc-800 sm:left-8 sm:right-8"
      >
        {newTokenForm ? (
          <NewTokenForm setNewTokenForm={setNewTokenForm} />
        ) : (
          <>
            <header className="relative mt-3 flex items-center justify-between">
              <DialogHeading className="px-4">Select a token</DialogHeading>
              <DialogDismiss className="absolute right-2 flex items-start justify-end">
                <XIcon className="h-6 w-6" />
              </DialogDismiss>
            </header>
            <Combobox
              state={combobox}
              autoSelect
              placeholder="Search name or paste address"
              className="m-4 rounded border px-3 py-[10px] slashed-zero"
            />
            <ComboboxList state={combobox} className="m-4 mt-0 cursor-pointer list-none overflow-auto">
              {combobox.matches.map((token) => (
                <ComboboxItem
                  key={token}
                  focusOnHover
                  className="scroll-mt-0 rounded active-item:bg-neutral-200 dark:active-item:bg-neutral-600"
                  onClick={() => {
                    select.setValue(token);
                    handleTokenChange(token);
                    dialog.toggle();
                    select.toggle();
                  }}
                >
                  {(props) => (
                    <SelectItem {...props}>
                      <Token value={token} />
                    </SelectItem>
                  )}
                </ComboboxItem>
              ))}
            </ComboboxList>
            <button
              className="m-4 mt-auto rounded bg-zinc-300 py-2 px-3 dark:bg-zinc-700"
              onClick={() => setNewTokenForm(true)}
            >
              or add a new token
            </button>
          </>
        )}
      </Dialog>
    </>
  );
}

const NewTokenForm = ({ setNewTokenForm }: { setNewTokenForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
  // TODO handle loading and error states
  const { mutate, isLoading } = useCreateLlamaPayContract();

  // TODO make sure this submit handler doesn't mess up DepositField submit handler like error field or loading states, as this is triggering that component forms submit func
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & { tokenAddress: { value: string } };
    const tokenAddress = form.tokenAddress?.value;
    mutate({ tokenAddress });
  };

  return (
    <>
      <header className="relative m-4 mt-3 flex items-center justify-between">
        <DialogHeading className="px-4">
          <button className="absolute left-0" onClick={() => setNewTokenForm(false)}>
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        </DialogHeading>
        <DialogDismiss className="absolute right-0 top-0 flex items-start justify-end">
          <XIcon className="h-6 w-6" />
        </DialogDismiss>
      </header>
      <form className="m-4 mt-[10%]" onSubmit={handleSubmit}>
        <InputText name="tokenAddress" isRequired={true} label="Token Address" />
        <SubmitButton className="mt-4 bg-zinc-300 disabled:cursor-not-allowed dark:bg-zinc-700" disabled={isLoading}>
          Add token
        </SubmitButton>
      </form>
    </>
  );
};
