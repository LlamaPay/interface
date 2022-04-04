import * as React from 'react';
import { Select, SelectArrow, SelectItem, SelectLabel, useSelectState } from 'ariakit/select';
import { Dialog, DialogDismiss, DialogHeading, useDialogState } from 'ariakit/dialog';
import { Combobox, ComboboxItem, ComboboxList, useComboboxState } from 'ariakit/combobox';

import classNames from 'classnames';
import { XIcon } from '@heroicons/react/solid';
import useGetAllTokens from 'queries/useGetAllTokens';

interface ISelectTokenProps {
  handleTokenChange: (token: string) => void;
  tokens: string[];
  className?: string;
}

function Token({ value, shortName }: { value: string; shortName?: boolean }) {
  const { data: tokens } = useGetAllTokens();

  const data = React.useMemo(() => {
    return tokens?.find((t) => t.name === value || t.tokenAddress === value);
  }, [value, tokens]);

  // TODO show token image and symbol for verified lists, else show token address
  return (
    <div className="flex flex-1 items-center space-x-2 overflow-x-hidden py-2 px-1">
      <div className="h-6 w-6 flex-shrink-0 rounded-full bg-orange-400"></div>
      {data ? (
        <div className="truncate">{shortName ? data.symbol : `${data.name} (${data.symbol})`}</div>
      ) : (
        <div className="truncate">{value}</div>
      )}
    </div>
  );
}

export function SelectToken({ handleTokenChange, tokens, className }: ISelectTokenProps) {
  const combobox = useComboboxState({ list: tokens });
  // value and setValue shouldn't be passed to the select state because the
  // select value and the combobox value are different things.
  const { value, setValue, ...selectProps } = combobox;
  const select = useSelectState({ ...selectProps, defaultValue: tokens[0] });

  // Resets combobox value when popover is collapsed
  if (!select.mounted && combobox.value) {
    combobox.setValue('');
  }

  const dialog = useDialogState();

  return (
    <>
      <SelectLabel state={select} className="sr-only">
        Select Token
      </SelectLabel>
      <Select
        state={select}
        className={classNames('flex w-full items-center rounded bg-green-100 p-2', className)}
        onClick={dialog.toggle}
      >
        {<Token value={select.value} shortName />}
        <SelectArrow />
      </Select>

      {/* use select state as dialog state so that combobox options are displayed */}
      <Dialog
        state={select}
        className="absolute top-8 left-4 right-4 bottom-8 z-50 m-auto mx-auto mt-auto flex max-h-[80vh] max-w-lg flex-col overflow-auto rounded bg-zinc-100 drop-shadow-lg  dark:bg-zinc-800 sm:left-8 sm:right-8"
      >
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
              className="scroll-mt-0 active-item:bg-amber-200"
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
        <button className="m-4 mt-auto rounded bg-red-100 py-2 px-3">or add a new token</button>
      </Dialog>
    </>
  );
}
