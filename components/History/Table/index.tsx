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
import HistoryAge from './HistoryAge';

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
      switch (event) {
        case 'Deposit':
          return 'Deposit';
        case 'StreamPaused':
          return 'Pause';
        case 'StreamResumed':
          return 'Resume';
        case 'Withdraw':
          return 'Withdraw';
        case 'StreamCreated':
          return cell.row.original.addressType === 'payer' ? 'Create Stream' : 'Receive Stream';
        case 'StreamCancelled':
          return 'Cancel Stream';
        case 'StreamModified':
          return 'Modify Stream';
        case 'PayerWithdraw':
          return 'Withdraw';
        default:
          return '';
      }
    },
  }),
  table.createDisplayColumn({
    id: 'addressName',
    header: 'Address / Name',
    cell: ({ cell }) => {
      if (cell.row.original === undefined) return;
      const eventType = cell.row.original.eventType;
      return eventType === 'Deposit' || eventType === 'PayerWithdraw' ? (
        'You'
      ) : (
        <SavedName value={cell.row.original.addressRelated !== null ? cell.row.original.addressRelated : ''} />
      );
    },
  }),
  table.createDisplayColumn({
    id: 'amount',
    header: 'Amount',
    cell: ({ cell }) => {
      if (cell.row.original == undefined) return;
      const info = cell.row.original;
      if (info.eventType === 'Deposit' || info.eventType === 'Withdraw' || info.eventType === 'PayerWithdraw') {
        return (
          <>
            <span>{`${(Number(info.amount) / 10 ** Number(info.token.decimals)).toLocaleString('en-US', {
              maximumFractionDigits: 5,
            })}`}</span>
            <span className="mx-1 text-xs text-gray-500 dark:text-gray-400">{info.token.symbol}</span>
          </>
        );
      } else {
        return <Amount value={info.amountPerSec} data={info} />;
      }
    },
  }),
  table.createDisplayColumn({
    id: 'age',
    header: 'Age',
    cell: ({ cell }) => {
      if (cell.row.original == undefined) return;
      return <HistoryAge data={cell.row.original} />;
    },
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
