import * as React from 'react';
import { Switch } from '@headlessui/react';
import { DisclosureState } from 'ariakit';
import { FormDialog } from '~/components/Dialog';
import { SubmitButton } from '~/components/Form';
import type { IHistory } from '~/types';
import { formatAddress } from '~/utils/address';
import { downloadCustomHistory } from '~/utils/downloadCsv';

interface IFormElements {
  startDate: { valueAsNumber: string };
  endDate: { valueAsNumber: string };
  event: { value: string };
}

export function CustomExportDialog({ data, dialog }: { data: IHistory[]; dialog: DisclosureState }) {
  const [hasAssignNames, setHasAssignNames] = React.useState<boolean>(false);

  const addresses = React.useMemo(() => {
    if (!data) return {};
    const addresses: { [key: string]: string } = {};
    data.forEach((event) => {
      if (!event.addressRelated) return;
      if (addresses[event.addressRelated] !== undefined) return;
      addresses[event.addressRelated] = '';
    });
    return addresses;
  }, [data]);

  const [tableContents, setTableContents] = React.useState<{ [key: string]: string }>(addresses);

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const address = e.target.name;
    const newTableContents = { ...tableContents };
    const value = e.target.value;
    newTableContents[address] = value;
    setTableContents(newTableContents);
  }

  function downloadCSV(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement & IFormElements;
    const start = new Date(form.startDate.valueAsNumber).toISOString().slice(0, 10);
    const end = new Date(form.endDate.valueAsNumber).toISOString().slice(0, 10);
    const event = form.event.value;

    downloadCustomHistory(data, { start: start, end: end }, event !== '' ? event : null, tableContents);
  }

  return (
    <FormDialog title="Export Custom CSV" className="h-fit" dialog={dialog}>
      <form className="flex flex-col gap-4" onSubmit={downloadCSV}>
        <label>
          <span className="input-label">Start Date</span>
          <input type="date" name="startDate" className="input-field" required />
        </label>

        <label>
          <span className="input-label">End Date</span>
          <input type="date" name="endDate" className="input-field" required />
        </label>

        <select name="event" required className="input-label w-full rounded dark:border-[#252525] dark:bg-[#202020]">
          <option value="AllEvents">{'All Events'}</option>
          <option value="Deposit">{'Deposit'}</option>
          <option value="Withdraw">{'Withdraw'}</option>
          <option value="PayerWithdraw">{'Payer Withdraw'}</option>
          <option value="StreamCreated">{'Create Stream'}</option>
          <option value="StreamCancelled">{'Cancel Stream'}</option>
          <option value="StreamModified">{'Modify Stream'}</option>
          <option value="StreamPaused">{'Pause'}</option>
          <option value="Gusto">{'Gusto'}</option>
        </select>

        <div className="flex gap-2">
          <span className="font-exo">{'Assign Names'}</span>
          <Switch
            checked={hasAssignNames}
            onChange={setHasAssignNames}
            className={`${
              hasAssignNames ? 'bg-lp-primary' : 'bg-gray-200 dark:bg-[#252525]'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                hasAssignNames ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>

        {hasAssignNames && (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-description text-sm font-semibold !text-lp-gray-4 dark:!text-white">Address</th>
                <th className="table-description text-sm font-semibold !text-lp-gray-4 dark:!text-white">Name</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableContents).map((p) => (
                <tr key={p} className="table-row">
                  <td className="table-description w-1/3 text-center dark:text-white">{formatAddress(p)}</td>
                  <td className="table-description dark:text-white">
                    <input
                      className="input-field m-0 min-w-[8rem] py-1 dark:text-white"
                      spellCheck="false"
                      inputMode="text"
                      type="text"
                      autoComplete="off"
                      autoCorrect="off"
                      value={tableContents[p]}
                      onChange={(e) => onNameChange(e)}
                      name={p}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <SubmitButton className="mt-5">{'Download'}</SubmitButton>
      </form>
    </FormDialog>
  );
}
