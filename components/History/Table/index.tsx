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
import { ActionName, HistoryActions, Amount, SavedName, HistoryAge, EventType } from './CustomValues';
import { downloadHistory } from 'utils/downloadCsv';
import { downloadInvoice } from 'utils/downloadInvoice';
import { useLocale } from 'hooks';
import { useAccount } from 'wagmi';

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
    cell: ({ cell }) =>
      cell.row.original && (
        <EventType event={cell.row.original.eventType} addressType={cell.row.original.addressType} />
      ),
  }),
  table.createDisplayColumn({
    id: 'addressName',
    header: 'Address / Name',
    cell: ({ cell }) =>
      cell.row.original && (
        <SavedName value={cell.row.original.addressRelated || ''} eventType={cell.row.original.eventType} />
      ),
  }),
  table.createDisplayColumn({
    id: 'amount',
    header: 'Amount',
    cell: ({ cell }) => cell.row.original && <Amount value={cell.row.original.amountPerSec} data={cell.row.original} />,
  }),
  table.createDisplayColumn({
    id: 'age',
    header: 'Age',
    cell: ({ cell }) => cell.row.original && <HistoryAge data={cell.row.original} />,
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
  const { locale } = useLocale();
  const [{ data: accountData }] = useAccount();

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
  const downloadToInvoice = React.useCallback(
    () => downloadInvoice(data, locale, accountData?.address ?? ''),
    [data, locale, accountData]
  );

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
      <Table instance={instance} downloadToCSV={downloadToCSV} downloadToInvoice={downloadToInvoice} />
    </>
  );
}
