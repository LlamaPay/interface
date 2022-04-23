import * as React from 'react';
import {
  createTable,
  getCoreRowModelSync,
  getGlobalFilteredRowModelSync,
  getPaginationRowModel,
  useTableInstance,
} from '@tanstack/react-table';
import Link from 'next/link';
import Table from 'components/Table';
import Fallback from 'components/FallbackList';
import { StreamIcon } from 'components/Icons';
import {
  TotalStreamed,
  Withdrawable,
  SavedName,
  StreamActions,
  AmtPerMonth,
  TokenName,
  StreamAddress,
} from './CustomValues';
import DisperseGasMoney from 'components/DisperseGas';
import { IStream } from 'types';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { downloadStreams } from 'utils/downloadCsv';
import { useAddressStore } from 'store/address';
import CustomWithdraw from 'components/withdrawOnBehalf';

const table = createTable<{ Row: IStream }>();

const defaultColumns = table.createColumns([
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
    header: () => (
      <>
        <span>Amount</span>
        <small className="mx-1 text-xs font-normal text-gray-500 dark:text-gray-400">per month</small>
      </>
    ),
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
    id: 'streamActions',
    header: '',
    cell: ({ cell }) => cell.row.original && <StreamActions data={cell.row.original} />,
  }),
]);

export function StreamTable() {
  const { data, isLoading, error } = useStreamsAndHistory();

  const streams = React.useMemo(() => {
    if (!data?.streams || data.streams?.length < 1) return false;

    return data.streams;
  }, [data]);

  return (
    <section className="w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between gap-[0.625rem]">
        <span className="flex items-center gap-[0.625rem]">
          <StreamIcon />
          <h1 className="font-exo">Streams</h1>
        </span>

        <div className="flex flex-wrap gap-[0.625rem]">
          <Link href="/create">
            <a className="primary-button py-2 px-8 text-sm font-bold">Create Stream</a>
          </Link>
          <DisperseGasMoney />
          <CustomWithdraw />
        </div>
      </div>
      {isLoading || error || !streams ? (
        <Fallback isLoading={isLoading} isError={error ? true : false} noData={true} type="streams" />
      ) : (
        <NewTable data={streams} />
      )}
    </section>
  );
}

function NewTable({ data }: { data: IStream[] }) {
  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns]);

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
    getPaginationRowModel: getPaginationRowModel(),
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
      <Table instance={instance} hidePagination={true} downloadToCSV={downloadToCSV} />
    </>
  );
}
