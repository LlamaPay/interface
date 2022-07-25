import * as React from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import Table from 'components/Table';
import { IHistory } from 'types';
import {
  ActionName,
  HistoryActions,
  Amount,
  SavedName,
  HistoryAge,
  EventType,
  CustomExportDialog,
  historyAmountFormatter,
  eventAgeFormatter,
} from './CustomValues';
import { downloadHistory } from 'utils/downloadCsv';
import { useTranslations } from 'next-intl';
import { useDialogState } from 'ariakit';

export function HistoryTable({ data }: { data: IHistory[] }) {
  const t = useTranslations('Table');

  const columns = React.useMemo<ColumnDef<IHistory>[]>(
    () => [
      {
        id: 'action',
        header: t('action'),
        cell: ({ cell }) => cell.row.original && <ActionName data={cell.row.original} />,
      },
      {
        id: 'type',
        header: t('type'),
        cell: ({ cell }) =>
          cell.row.original && (
            <EventType event={cell.row.original.eventType} addressType={cell.row.original.addressType} />
          ),
      },
      {
        id: 'addressName',
        header: t('addressName'),
        cell: ({ cell }) =>
          cell.row.original && (
            <SavedName
              value={cell.row.original.addressRelated || ''}
              eventType={cell.row.original.eventType}
              ens={cell.row.original.addressRelatedEns}
            />
          ),
      },
      {
        accessorFn: historyAmountFormatter,
        id: 'amount',
        header: t('amount'),
        cell: ({ cell }) =>
          cell.row.original && <Amount value={cell.row.original.amountPerSec} data={cell.row.original} />,
      },
      {
        accessorFn: (row) => eventAgeFormatter(row.createdTimestamp),
        id: 'age',
        header: t('age'),
        cell: ({ cell }) => cell.row.original && <HistoryAge data={cell.row.original} />,
      },
      {
        id: 'historyActions',
        header: '',
        cell: ({ cell }) => cell.row.original && <HistoryActions data={cell.row.original} />,
      },
    ],
    [t]
  );

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const instance = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const downloadToCSV = React.useCallback(() => downloadHistory(data), [data]);
  const customHistoryDialog = useDialogState();

  return (
    <>
      <Table instance={instance} downloadToCSV={downloadToCSV} customHistory={customHistoryDialog} />
      <CustomExportDialog data={data} dialog={customHistoryDialog} />
    </>
  );
}
