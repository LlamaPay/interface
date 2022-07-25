import * as React from 'react';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
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
import { useTranslations } from 'next-intl';
import Schedule from '../../Schedule/Schedule';

export function StreamTable({ data }: { data: IStream[] }) {
  const addressStore = useAddressStore();

  const t = useTranslations('Table');

  const columns = React.useMemo<ColumnDef<IStream>[]>(
    () => [
      {
        id: 'userName',
        header: t('userName'),
        cell: ({ cell }) => cell.row.original && <SavedName data={cell.row.original} />,
      },
      {
        id: 'address',
        header: t('address'),
        cell: ({ cell }) => cell.row.original && <StreamAddress data={cell.row.original} />,
      },
      {
        header: t('tokenSymbol'),
        cell: ({ cell }) => cell.row.original && <TokenName data={cell.row.original} />,
      },
      {
        id: 'amountPerSec',
        header: t('amountPerSec'),
        cell: ({ cell }) => cell.row.original && <AmtPerMonth data={cell.row.original} />,
      },
      {
        id: 'totalStreamed',
        header: t('totalStreamed'),
        cell: ({ cell }) => cell.row.original && <TotalStreamed data={cell.row.original} />,
      },
      {
        id: 'userWithdrawable',
        header: t('userWithdrawable'),
        cell: ({ cell }) => cell.row.original && <Withdrawable data={cell.row.original} />,
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
          if (!data) return null;
          return <Schedule data={data} />;
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
    [t]
  );

  const instance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const downloadToCSV = React.useCallback(() => {
    const names = addressStore.addressBook;
    downloadStreams(data, names);
  }, [data, addressStore]);

  return <Table instance={instance} hidePagination={true} downloadToCSV={downloadToCSV} maxWidthColumn={7} />;
}

export function DefaultStreamTable({ data }: { data: IStream[] }) {
  const t = useTranslations('Table');

  const columns = React.useMemo<ColumnDef<IStream>[]>(
    () => [
      {
        id: 'userName',
        header: t('userName'),
        cell: ({ cell }) => cell.row.original && <SavedName data={cell.row.original} />,
      },
      {
        id: 'address',
        header: t('address'),
        cell: ({ cell }) => cell.row.original && <StreamAddress data={cell.row.original} />,
      },
      {
        header: t('tokenSymbol'),
        cell: ({ cell }) => cell.row.original && <TokenName data={cell.row.original} />,
      },
      {
        id: 'amountPerSec',
        header: t('amountPerSec'),
        cell: ({ cell }) => cell.row.original && <AmtPerMonth data={cell.row.original} />,
      },
      {
        id: 'totalStreamed',
        header: t('totalStreamed'),
        cell: ({ cell }) => cell.row.original && <TotalStreamed data={cell.row.original} />,
      },
      {
        id: 'userWithdrawable',
        header: t('userWithdrawable'),
        cell: ({ cell }) => cell.row.original && <Withdrawable data={cell.row.original} />,
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
    [t]
  );

  const instance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table instance={instance} hidePagination={true} />;
}
