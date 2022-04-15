import * as React from 'react';
import { createTable, useTable, PaginationState, paginateRowsFn, globalFilterRowsFn } from '@tanstack/react-table';
import Table from 'components/Table';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { IStream } from 'types';
import TotalStreamed from './TotalStreamed';
import Withdrawable from './Withdrawable';
import SavedName from './SavedName';
import StreamActions from './StreamActions';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/solid';
import AmtPerMonth from './AmtPerMonth';

const table = createTable<{ Row: IStream }>();

const defaultColumns = table.createColumns([
  table.createDisplayColumn({
    id: 'userName',
    header: 'Name',
    cell: ({ cell }) => (cell.row.original ? <SavedName data={cell.row.original} /> : <></>),
  }),
  table.createDisplayColumn({
    id: 'address',
    header: 'Address',
    cell: ({ cell }) => {
      if (!cell.row.original) return null;
      if (cell.row.original?.streamType === 'incomingStream') {
        return cell.row.original.payerAddress;
      } else {
        return cell.row.original?.payeeAddress;
      }
    },
  }),
  table.createDataColumn('tokenSymbol', {
    header: 'Token',
  }),
  table.createDisplayColumn({
    id: 'amountPerSec',
    header: () => (
      <>
        <span>Amount</span>
        <small className="mx-1 text-xs font-normal text-gray-500 dark:text-gray-400">per month</small>
      </>
    ),
    cell: ({ cell }) => (cell.row.original ? <AmtPerMonth data={cell.row.original} /> : <></>),
  }),
  table.createDisplayColumn({
    id: 'totalStreamed',
    header: 'Total Streamed',
    cell: ({ cell }) => (cell.row.original ? <TotalStreamed data={cell.row.original} /> : <></>),
  }),
  table.createDisplayColumn({
    id: 'userWithdrawable',
    header: 'Withdrawable',
    cell: ({ cell }) => (cell.row.original ? <Withdrawable data={cell.row.original} /> : <></>),
  }),
  table.createDisplayColumn({
    id: 'streamActions',
    header: '',
    cell: ({ cell }) => {
      if (!cell.row.original) return null;

      return <StreamActions data={cell.row.original} />;
    },
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
        <h1 className="text-2xl">Streams</h1>
        {/* <label className="space-x-4">
          <span>Search</span>
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 rounded border border-neutral-300 p-2 shadow-sm dark:border-neutral-700"
          />
        </label> */}
        <Link href="/create" passHref>
          <button className="flex items-center space-x-2 whitespace-nowrap rounded bg-green-100 py-1 px-2 text-sm shadow dark:bg-[#153723]">
            <PlusIcon className="h-[14px] w-[14px]" />
            <span>Create</span>
          </button>
        </Link>
      </div>
      <Table instance={instance} />
    </section>
  );
}
