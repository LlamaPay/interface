import { Switch } from '@headlessui/react';
import { DisclosureState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { InputText, SubmitButton } from 'components/Form';
import React from 'react';
import { IHistory } from 'types';
import { downloadCustomHistory } from 'utils/downloadCsv';

interface ICustomExportElements {
  start: { value: string };
  end: { value: string };
  event: { value: string };
}

export default function CustomExportDialog({ data, dialog }: { data: IHistory[]; dialog: DisclosureState }) {
  const [hasEventType, setHasEventType] = React.useState<boolean>(false);

  function downloadCSV(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement & ICustomExportElements;
    downloadCustomHistory(
      data,
      { start: form.startDate?.value, end: form.endDate?.value },
      hasEventType ? form.event?.value : null
    );
  }

  return (
    <FormDialog title="Export Custom CSV" className="h-fit" dialog={dialog}>
      <form className="space-y-2" onSubmit={downloadCSV}>
        <InputText
          label={'Start Date (YYYY-MM-DD)'}
          name="startDate"
          isRequired
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
        ></InputText>
        <InputText
          label={'End Date (YYYY-MM-DD)'}
          name="endDate"
          isRequired
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
        ></InputText>
        <div className="flex gap-2">
          <span className="font-exo">{'Event'}</span>
          <Switch
            checked={hasEventType}
            onChange={setHasEventType}
            className={`${
              hasEventType ? 'bg-[#23BD8F]' : 'bg-gray-200 dark:bg-[#252525]'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                hasEventType ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>
        {hasEventType && (
          <select name="event" required className="input-label w-full rounded dark:border-[#252525] dark:bg-[#202020]">
            <option value="Deposit">{'Deposit'}</option>
            <option value="Withdraw">{'Withdraw'}</option>
            <option value="PayerWithdraw">{'Payer Withdraw'}</option>
            <option value="StreamCreated">{'Create Stream'}</option>
            <option value="StreamCancelled">{'Cancel Stream'}</option>
            <option value="StreamModified">{'Modify Stream'}</option>
            <option value="StreamPaused">{'Pause'}</option>
          </select>
        )}
        <SubmitButton className="mt-5">{'Download'}</SubmitButton>
      </form>
    </FormDialog>
  );
}
