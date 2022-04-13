import * as React from 'react';
import { createTable, useTable } from '@tanstack/react-table';
import Table from 'components/Table';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { IStream } from 'types';
import { secondsByDuration } from 'utils/constants';
import TotalStreamed from './TotalStreamed';
import Withdrawable from './Withdrawable';
import SavedName from './SavedName';

const table = createTable<{ Row: IStream }>();

const defaultColumns = table.createColumns([
  table.createDisplayColumn({
    id: 'userName',
    header: 'Name',
    cell: ({ cell }) => (cell.row.original ? <SavedName data={cell.row.original} /> : <></>),
  }),
  table.createDataColumn('tokenSymbol', {
    header: 'Token',
  }),
  table.createDataColumn('amountPerSec', {
    header: () => (
      <>
        <span>Amount</span>
        <small className="mx-1 text-xs font-normal text-gray-500 dark:text-gray-400">per month</small>
      </>
    ),
    cell: ({ value }) => {
      const amount = value && ((Number(value) * secondsByDuration['month']) / 1e20).toFixed(5);
      return <>{amount}</>;
    },
  }),
  table.createDataColumn('createdTimestamp', {
    header: 'Total Streamed',
    cell: ({ value, cell }) => {
      const amountPerSec = cell.row.values.amountPerSec;

      const isDataValid = !Number.isNaN(value) && !Number.isNaN(amountPerSec);

      if (!isDataValid) return <></>;

      return <TotalStreamed createdAt={value} amountPerSec={amountPerSec} />;
    },
  }),
  table.createDisplayColumn({
    id: 'userWithdrawable',
    header: 'Withdrawable',
    cell: ({ cell }) => (cell.row.original ? <Withdrawable data={cell.row.original} /> : <></>),
  }),
]);

export function StreamTable() {
  const { data: streamsAndHistory, isLoading, error } = useStreamsAndHistory();

  if (isLoading || error) {
    // TODO show placeholder
    return null;
  }

  return <NewTable data={streamsAndHistory.streams || []} />;
}

function NewTable({ data }: { data: IStream[] }) {
  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns]);

  const instance = useTable(table, {
    data,
    columns,
  });

  return <Table instance={instance} />;
}
