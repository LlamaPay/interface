import * as React from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import Table from '~/components/Table';
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
import { downloadHistory } from '~/utils/downloadCsv';
import { useTranslations } from 'next-intl';
import { useDialogState } from 'ariakit';
import useDebounce from '~/hooks/useDebounce';
import type { IHistory } from '~/queries/salary/useGetSalaryInfo';

export function HistoryTable({ data }: { data: Array<IHistory> }) {
  const t = useTranslations('Table');

  const columns = React.useMemo<ColumnDef<IHistory>[]>(
    () => [
      {
        id: 'action',
        header: t('action'),
        cell: ({ cell }) => cell.row.original && <ActionName data={cell.row.original} />,
      },
      {
        accessorFn: (row) => row.eventType,
        id: 'type',
        header: t('type'),
        cell: ({ cell }) =>
          cell.row.original && (
            <EventType event={cell.row.original.eventType} addressType={cell.row.original.addressType} />
          ),
      },
      {
        accessorFn: (row) => row.addressRelated,
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
        accessorFn: (row) => String(historyAmountFormatter(row)),
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

  const [tableFilter, setTableFilter] = React.useState('');
  const globalFilter = useDebounce(tableFilter, 300);

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
      globalFilter,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const downloadToCSV = React.useCallback(() => downloadHistory(data), [data]);
  const customHistoryDialog = useDialogState();

  return (
    <>
      <input
        name="search table"
        placeholder="Search..."
        className="max-w-[300px] rounded border border-lp-gray-1 bg-lp-white px-3 py-1 slashed-zero placeholder:text-sm placeholder:text-lp-gray-2 dark:border-transparent dark:bg-lp-gray-5"
        value={tableFilter}
        onChange={(e) => setTableFilter(e.target.value)}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
      />
      <Table instance={instance} downloadToCSV={downloadToCSV} customHistory={customHistoryDialog} />
      <CustomExportDialog data={data} dialog={customHistoryDialog} />
    </>
  );
}
