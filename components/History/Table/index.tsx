import * as React from 'react';
import { createTable, useTable, PaginationState, paginateRowsFn, globalFilterRowsFn } from '@tanstack/react-table';
import Table from 'components/Table';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { IHistory } from 'types';
import { secondsByDuration } from 'utils/constants';
import { formatAddress } from 'utils/address';
import { formatAmountInTable } from 'utils/amount';
import ActionName from './ActionName';
import HistoryActions from './HistoryActions';

const table = createTable<{ Row: IHistory }>();

const defaultColumns = table.createColumns([
  table.createDataColumn('eventType', {
    header: 'Action',
    cell: ({ value }) => <ActionName name={value} />,
  }),
  table.createDataColumn('addressRelated', {
    header: 'Address related',
    cell: ({ value }) => <>{value && formatAddress(value)}</>,
  }),
  table.createDataColumn('amountPerSec', {
    header: () => (
      <>
        <span>Amount</span>
        <small className="mx-1 text-xs font-normal text-gray-500 dark:text-gray-400">per month</small>
      </>
    ),
    cell: ({ value }) => {
      const isDataValid = !Number.isNaN(value);
      const amount = isDataValid && formatAmountInTable(Number(value) / 1e20, secondsByDuration['month']);
      return <>{amount}</>;
    },
  }),
  table.createDisplayColumn({
    id: 'historyActions',
    header: '',
    cell: ({ cell }) => {
      if (!cell.row.original) return null;

      return <HistoryActions data={cell.row.original} />;
    },
  }),
]);

export function HistoryTable() {
  const { data: streamsAndHistory, isLoading, error } = useStreamsAndHistory();

  if (isLoading || error) {
    // TODO show placeholder
    return null;
  }

  return <NewTable data={streamsAndHistory.history || []} />;
}

function NewTable({ data }: { data: IHistory[] }) {
  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns]);

  const [globalFilter, setGlobalFilter] = React.useState('');

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    pageCount: -1, // -1 allows the table to calculate the page count for us via instance.getPageCount()
  });

  const instance = useTable(table, {
    data,
    columns,
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterRowsFn: globalFilterRowsFn,
    onPaginationChange: setPagination,
    paginateRowsFn: paginateRowsFn,
  });

  return (
    <section className="w-full">
      <div className="mb-2 flex w-full items-center justify-between">
        <h1 className="text-2xl">History</h1>
        <label className="space-x-4">
          <span>Search</span>
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 rounded border border-neutral-300 p-2 shadow-sm dark:border-neutral-700"
          />
        </label>
      </div>
      <Table instance={instance} />
    </section>
  );
}
