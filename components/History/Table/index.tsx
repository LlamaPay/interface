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
import ActionName from './ActionName';
import HistoryActions from './HistoryActions';
import { downloadHistory } from 'utils/downloadCsv';
import Amount from './Amount';
import { SavedName } from './SavedName';

const table = createTable().setRowType<IHistory>();

const defaultColumns = table.createColumns([
  table.createDisplayColumn({
    id: 'action',
    header: 'Action',
    cell: ({ cell }) => cell.row.original && <ActionName data={cell.row.original} />,
  }),
  table.createDisplayColumn({
    id: 'type',
    header: 'Type',
    cell: ({ cell }) => {
      if (cell.row.original === undefined) return;
      const event = cell.row.original.eventType;
      return event === 'Deposit'
        ? 'Deposit'
        : event === 'Withdraw'
        ? 'Withdraw'
        : cell.row.original.addressType === 'payer'
        ? 'Outgoing'
        : 'Incoming';
    },
  }),
  table.createDisplayColumn({
    id: 'addressName',
    header: 'Address / Name',
    cell: ({ cell }) => {
      if (cell.row.original === undefined) return;
      return cell.row.original.eventType === 'Deposit' ? 'You' : <SavedName value={cell.row.original.addressRelated} />;
    },
  }),
  table.createDataColumn('amountPerSec', {
    header: 'Amount',
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
