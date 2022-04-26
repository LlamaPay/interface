import * as React from 'react';
import {
  createTable,
  getCoreRowModelSync,
  getGlobalFilteredRowModelSync,
  getPaginationRowModel,
  useTableInstance,
  PaginationState,
} from '@tanstack/react-table';
import Table from 'components/Table';
import { IHistory } from 'types';
import { formatAddress } from 'utils/address';
import ActionName from './ActionName';
import HistoryActions from './HistoryActions';
import { downloadHistory } from 'utils/downloadCsv';
import Tooltip from 'components/Tooltip';
import Amount from './Amount';

const table = createTable().setRowType<IHistory>();

const defaultColumns = table.createColumns([
  table.createDisplayColumn({
    id: 'action',
    header: 'Action',
    cell: ({ cell }) => cell.row.original && <ActionName data={cell.row.original} />,
  }),
  table.createDataColumn('addressType', {
    header: 'Type',
    cell: ({ value }) => <span>{value === 'payer' ? 'Outgoing' : 'Incoming'}</span>,
  }),
  table.createDataColumn('addressRelated', {
    header: 'Address related',
    cell: ({ value }) => <Tooltip content={value}>{value && formatAddress(value)}</Tooltip>,
  }),
  table.createDataColumn('amountPerSec', {
    header: () => (
      <>
        <span>Amount</span>
        <small className="mx-1 text-xs font-normal text-gray-500 dark:text-gray-400">per month</small>
      </>
    ),
    cell: ({ value, cell }) => <Amount data={cell.row.original} value={value} />,
  }),
  table.createDisplayColumn({
    id: 'historyActions',
    header: '',
    cell: ({ cell }) => cell.row.original && <HistoryActions data={cell.row.original} />,
  }),
]);

export function HistoryTable({ data }: { data: IHistory[] }) {
  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns]);

  const [globalFilter, setGlobalFilter] = React.useState('');

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    pageCount: -1, // -1 allows the table to calculate the page count for us via instance.getPageCount()
  });

  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      globalFilter,
      pagination,
    },

    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModelSync(),
    getGlobalFilteredRowModel: getGlobalFilteredRowModelSync(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  const downloadToCSV = React.useCallback(() => downloadHistory(data), [data]);

  return (
    <>
      {/* <label className="space-x-4">
          <span>Search</span>
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 rounded border border-neutral-300 p-2 shadow-sm dark:border-neutral-700"
          />
        </label> */}

      <Table instance={instance} downloadToCSV={downloadToCSV} />
    </>
  );
}
