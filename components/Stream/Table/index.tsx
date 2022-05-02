import * as React from 'react';
import {
  createTable,
  getCoreRowModelSync,
  getGlobalFilteredRowModelSync,
  useTableInstance,
} from '@tanstack/react-table';
import Table from 'components/Table';
import {
  TotalStreamed,
  Withdrawable,
  SavedName,
  AmtPerMonth,
  TokenName,
  StreamAddress,
  Resume,
  Pause,
  Push,
  Modify,
  StreamHistory,
  Cancel,
} from './CustomValues';
import { IStream } from 'types';
import { downloadStreams } from 'utils/downloadCsv';
import { useAddressStore } from 'store/address';

const defaultTable = createTable().setRowType<IStream>();

const defaultTableColumns = defaultTable.createColumns([
  defaultTable.createDisplayColumn({
    id: 'userName',
    header: 'Name',
    cell: ({ cell }) => cell.row.original && <SavedName data={cell.row.original} />,
  }),
  defaultTable.createDisplayColumn({
    id: 'address',
    header: 'Address',
    cell: ({ cell }) => cell.row.original && <StreamAddress data={cell.row.original} />,
  }),
  defaultTable.createDataColumn('tokenSymbol', {
    header: 'Token',
    cell: ({ cell }) => cell.row.original && <TokenName data={cell.row.original} />,
  }),
  defaultTable.createDisplayColumn({
    id: 'amountPerSec',
    header: 'Amount',
    cell: ({ cell }) => cell.row.original && <AmtPerMonth data={cell.row.original} />,
  }),
  defaultTable.createDisplayColumn({
    id: 'totalStreamed',
    header: 'Total Streamed',
    cell: ({ cell }) => cell.row.original && <TotalStreamed data={cell.row.original} />,
  }),
  defaultTable.createDisplayColumn({
    id: 'userWithdrawable',
    header: 'Withdrawable',
    cell: ({ cell }) => cell.row.original && <Withdrawable data={cell.row.original} />,
  }),
  defaultTable.createDisplayColumn({
    id: 'history',
    header: '',
    cell: ({ cell }) =>
      cell.row.original && (
        <span className="flex justify-end">
          <StreamHistory data={cell.row.original} />
        </span>
      ),
  }),
]);

const table = createTable().setRowType<IStream>();

const streamTableColumns = table.createColumns([
  table.createDisplayColumn({
    id: 'userName',
    header: 'Name',
    cell: ({ cell }) => cell.row.original && <SavedName data={cell.row.original} />,
  }),
  table.createDisplayColumn({
    id: 'address',
    header: 'Address',
    cell: ({ cell }) => cell.row.original && <StreamAddress data={cell.row.original} />,
  }),
  table.createDataColumn('tokenSymbol', {
    header: 'Token',
    cell: ({ cell }) => cell.row.original && <TokenName data={cell.row.original} />,
  }),
  table.createDisplayColumn({
    id: 'amountPerSec',
    header: 'Amount',
    cell: ({ cell }) => cell.row.original && <AmtPerMonth data={cell.row.original} />,
  }),
  table.createDisplayColumn({
    id: 'totalStreamed',
    header: 'Total Streamed',
    cell: ({ cell }) => cell.row.original && <TotalStreamed data={cell.row.original} />,
  }),
  table.createDisplayColumn({
    id: 'userWithdrawable',
    header: 'Withdrawable',
    cell: ({ cell }) => cell.row.original && <Withdrawable data={cell.row.original} />,
  }),
  table.createDisplayColumn({
    id: 'send',
    header: '',
    cell: ({ cell }) => {
      const data = cell.row.original;

      if (!data || data.streamType === 'incomingStream') return null;

      return (
        <div className="w-full">
          <Push buttonName="Send" data={data} />
        </div>
      );
    },
  }),
  table.createDisplayColumn({
    id: 'modify',
    header: '',
    cell: ({ cell }) => {
      const data = cell.row.original;

      if (!data || data.streamType === 'incomingStream') return null;

      return <Modify data={data} />;
    },
  }),
  table.createDisplayColumn({
    id: 'pauseOrResume',
    header: '',
    cell: ({ cell }) => {
      const data = cell.row.original;

      if (!data || data.streamType === 'incomingStream') return null;

      return <>{data.paused ? <Resume data={data} /> : <Pause data={data} />}</>;
    },
  }),
  table.createDisplayColumn({
    id: 'history',
    header: '',
    cell: ({ cell }) => {
      const data = cell.row.original;

      if (!data) return null;

      return <StreamHistory data={data} />;
    },
  }),
  table.createDisplayColumn({
    id: 'cancelOrWithdraw',
    header: '',
    cell: ({ cell }) => {
      const data = cell.row.original;

      if (!data) return null;

      return (
        <>
          {data.streamType === 'incomingStream' ? <Push buttonName="Withdraw" data={data} /> : <Cancel data={data} />}
        </>
      );
    },
  }),
]);

export function StreamTable({ data }: { data: IStream[] }) {
  const [columns] = React.useState<typeof streamTableColumns>(() => [...streamTableColumns]);

  const [globalFilter, setGlobalFilter] = React.useState('');
  const addressStore = useAddressStore();

  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModelSync(),
    getGlobalFilteredRowModel: getGlobalFilteredRowModelSync(),
  });

  const downloadToCSV = React.useCallback(() => {
    const names = addressStore.addressBook;
    downloadStreams(data, names);
  }, [data, addressStore]);

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
      <Table instance={instance} hidePagination={true} downloadToCSV={downloadToCSV} maxWidthColumn={7} />
    </>
  );
}

export function DefaultStreamTable({ data }: { data: IStream[] }) {
  const [columns] = React.useState<typeof defaultTableColumns>(() => [...defaultTableColumns]);

  const [globalFilter, setGlobalFilter] = React.useState('');

  const instance = useTableInstance(defaultTable, {
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModelSync(),
    getGlobalFilteredRowModel: getGlobalFilteredRowModelSync(),
  });

  return <Table instance={instance} hidePagination={true} />;
}
