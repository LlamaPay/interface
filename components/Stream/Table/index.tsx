import * as React from 'react';
import Link from 'next/link';
import { ColumnDef, getCoreRowModel, useReactTable, getSortedRowModel, SortingState } from '@tanstack/react-table';
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
  amtPerMonthFormatter,
  streamAddressFormatter,
  totalStreamedFormatter,
} from './CustomValues';
import { IStream } from 'types';
import { downloadStreams } from 'utils/downloadCsv';
import { useAddressStore } from 'store/address';
import { useTranslations } from 'next-intl';
import Schedule from '../../Schedule/Schedule';
import { useNetworkProvider } from 'hooks';
import Tooltip from 'components/Tooltip';
import { ClipboardCopyIcon } from '@heroicons/react/outline';

export function StreamTable({ data }: { data: IStream[] }) {
  const addressStore = useAddressStore();
  const { nativeCurrency, chainId, network } = useNetworkProvider();
  const t = useTranslations('Table');

  const columns = React.useMemo<ColumnDef<IStream>[]>(
    () => [
      {
        id: 'userName',
        header: t('userName'),
        cell: ({ cell }) => cell.row.original && <SavedName data={cell.row.original} />,
      },
      {
        accessorFn: (row) => streamAddressFormatter(row).valueToSort,
        id: 'address',
        header: t('address'),
        cell: (info) => <StreamAddress data={streamAddressFormatter(info.cell.row.original)} />,
        enableMultiSort: true,
      },
      {
        accessorKey: 'tokenSymbol',
        header: t('tokenSymbol'),
        cell: ({ cell }) => cell.row.original && <TokenName data={cell.row.original} />,
        enableMultiSort: true,
      },
      {
        accessorFn: (row) => amtPerMonthFormatter(row.amountPerSec),
        id: 'amountPerSec',
        header: t('amountPerSec'),
        cell: (info) => <AmtPerMonth data={info.getValue() as number} />,
        enableMultiSort: true,
      },
      {
        accessorFn: totalStreamedFormatter,
        id: 'totalStreamed',
        header: t('totalStreamed'),
        cell: ({ cell }) => cell.row.original && <TotalStreamed data={cell.row.original} />,
        enableMultiSort: true,
      },
      {
        id: 'userWithdrawable',
        header: t('userWithdrawable'),
        cell: ({ cell }) => cell.row.original && <Withdrawable data={cell.row.original} />,
      },

      {
        accessorKey: 'streamId',
        id: 'linkToStream',
        header: '',
        cell: (info) =>
          network && (
            <Tooltip
              content="Copy link to stream"
              onClick={() =>
                navigator.clipboard.writeText(`https://llamapay.io/salaries/withdraw/${network}/${info.getValue()}`)
              }
              className="relative top-[1px] ml-auto flex items-center"
            >
              <ClipboardCopyIcon className="h-4 w-4 text-black dark:text-white" />
            </Tooltip>
          ),
        enableSorting: false,
      },

      {
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
      },
      {
        id: 'modify',
        header: '',
        cell: ({ cell }) => {
          const data = cell.row.original;

          if (!data || data.streamType === 'incomingStream') return null;

          return <Modify data={data} />;
        },
      },
      {
        id: 'pauseOrResume',
        header: '',
        cell: ({ cell }) => {
          const data = cell.row.original;

          if (!data || data.streamType === 'incomingStream') return null;

          return <>{data.paused ? <Resume data={data} /> : <Pause data={data} />}</>;
        },
      },
      {
        id: 'history',
        header: '',
        cell: ({ cell }) => {
          const data = cell.row.original;

          if (!data) return null;

          return <StreamHistory data={data} />;
        },
      },
      {
        id: 'schedule',
        header: '',
        cell: ({ cell }) => {
          const data = cell.row.original;
          if (!data || !chainId) return null;
          if (chainId !== 43114 && chainId !== 5 && chainId !== 1) return null;
          return <Schedule data={data} nativeCurrency={nativeCurrency?.symbol ?? 'ETH'} chainId={chainId} />;
        },
      },
      {
        id: 'cancelOrWithdraw',
        header: '',
        cell: ({ cell }) => {
          const data = cell.row.original;

          if (!data) return null;

          return (
            <>
              {data.streamType === 'incomingStream' ? (
                <Push buttonName="Withdraw" data={data} />
              ) : (
                <Cancel data={data} />
              )}
            </>
          );
        },
      },
    ],
    [t, chainId, nativeCurrency?.symbol, network]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const instance = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const downloadToCSV = React.useCallback(() => {
    const names = addressStore.addressBook;
    downloadStreams(data, names);
  }, [data, addressStore]);

  return <Table instance={instance} hidePagination={true} downloadToCSV={downloadToCSV} maxWidthColumn={7} />;
}

export function DefaultStreamTable({ data }: { data: IStream[] }) {
  const t = useTranslations('Table');

  const { network } = useNetworkProvider();

  const columns = React.useMemo<ColumnDef<IStream>[]>(
    () => [
      {
        id: 'userName',
        header: t('userName'),
        cell: ({ cell }) => cell.row.original && <SavedName data={cell.row.original} />,
      },
      {
        accessorFn: (row) => streamAddressFormatter(row).valueToSort,
        id: 'address',
        header: t('address'),
        cell: (info) => <StreamAddress data={streamAddressFormatter(info.cell.row.original)} />,
        enableMultiSort: true,
      },
      {
        accessorKey: 'tokenSymbol',
        header: t('tokenSymbol'),
        cell: ({ cell }) => cell.row.original && <TokenName data={cell.row.original} />,
        enableMultiSort: true,
      },
      {
        accessorFn: (row) => amtPerMonthFormatter(row.amountPerSec),
        id: 'amountPerSec',
        header: t('amountPerSec'),
        cell: (info) => <AmtPerMonth data={info.getValue() as number} />,
        enableMultiSort: true,
      },
      {
        accessorFn: totalStreamedFormatter,
        id: 'totalStreamed',
        header: t('totalStreamed'),
        cell: ({ cell }) => cell.row.original && <TotalStreamed data={cell.row.original} />,
        enableMultiSort: true,
      },
      {
        id: 'userWithdrawable',
        header: t('userWithdrawable'),
        cell: ({ cell }) => cell.row.original && <Withdrawable data={cell.row.original} />,
      },
      {
        accessorKey: 'streamId',
        id: 'linkToStream',
        header: '',
        cell: (info) =>
          network && (
            <Tooltip
              content="Copy link to stream"
              onClick={() =>
                navigator.clipboard.writeText(`https://llamapay.io/salaries/withdraw/${network}/${info.getValue()}`)
              }
              className="relative top-[1px] ml-auto flex items-center"
            >
              <ClipboardCopyIcon className="h-4 w-4 text-black dark:text-white" />
            </Tooltip>
          ),
        enableSorting: false,
      },
      {
        accessorKey: 'streamId',
        header: '',
        cell: (info) =>
          network && (
            <Link href={`/salaries/withdraw/${network}/${info.getValue()}`}>
              <a className="row-action-links">Withdraw</a>
            </Link>
          ),
        enableSorting: false,
      },
      {
        id: 'history',
        header: '',
        cell: ({ cell }) =>
          cell.row.original && (
            <span className="flex justify-end">
              <StreamHistory data={cell.row.original} />
            </span>
          ),
      },
    ],
    [t, network]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const instance = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return <Table instance={instance} hidePagination={true} maxWidthColumn={7} />;
}
