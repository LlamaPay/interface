import * as React from 'react';
import { Select, SelectArrow, SelectItem, SelectLabel, useSelectState } from 'ariakit/select';
import { Dialog, DialogDismiss, DialogHeading, useDialogState } from 'ariakit/dialog';
import { Combobox, ComboboxItem, ComboboxList, useComboboxState } from 'ariakit/combobox';
import classNames from 'classnames';
import { XIcon, ArrowRightIcon } from '@heroicons/react/solid';
import { useTranslations } from 'next-intl';
import { CreateNewToken } from './CreateNewToken';
import { TokenItem } from './TokenItem';

interface ISelectTokenProps {
  handleTokenChange: (token: string) => void;
  tokens: string[];
  label?: string;
  className?: string;
  hideNewTokenForm?: boolean;
}

export const SelectToken = React.forwardRef<HTMLButtonElement, ISelectTokenProps>(function S(
  { handleTokenChange, tokens, label, className, hideNewTokenForm = false },
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
        {<TokenItem value={select.value} shortName />}
        <SelectArrow className="relative right-[-2px]" />
      </Select>

      <Dialog
        state={dialog}
        className="shadow-2 dark:bg-[#] absolute top-8 left-4 right-4 bottom-8 z-50 m-auto mx-auto mt-auto flex max-h-[80vh] max-w-lg flex-col overflow-auto rounded bg-white dark:bg-[#333336] sm:left-8 sm:right-8"
      >
        {newTokenForm ? (
          <CreateNewToken setNewTokenForm={setNewTokenForm} />
        ) : (
          <>
            <header className="relative mt-3 flex items-center justify-between">
              <DialogHeading className="px-4">{t1('selectToken')}</DialogHeading>
              <DialogDismiss className="absolute right-3 flex items-start justify-end">
                <span className="sr-only">{t0('close')}</span>
                <XIcon className="h-6 w-6" />
              </DialogDismiss>
            </header>
            <Combobox
              state={combobox}
              autoSelect
              placeholder={t1('searchNameOrAddress')}
              className="m-4 rounded border px-3 py-[10px] slashed-zero dark:border-neutral-700"
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
                      <TokenItem value={token} showBalance />
                    </SelectItem>
                  )}
                </ComboboxItem>
              ))}

              {hideNewTokenForm && combobox.matches.length === 0 && combobox.value.length === 42 && (
                <div
                  role="option"
                  aria-selected="false"
                  className="rounded hover:bg-neutral-100 dark:hover:bg-neutral-600"
                  onClick={() => {
                    select.setValue(combobox.value);
                    handleTokenChange(combobox.value);
                    dialog.toggle();
                    select.toggle();
                  }}
                >
                  <TokenItem value={combobox.value} showBalance />
                </div>
              )}
            </ComboboxList>

            {!hideNewTokenForm && (
              <button
                className="nav-button m-4 mt-auto flex items-center justify-center gap-2 rounded dark:border-[#1BDBAD] dark:bg-[#23BD8F] dark:text-white"
                onClick={() => setNewTokenForm(true)}
              >
                <span>{t1('orAddANewToken')}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </Dialog>
    </>
  );
});
