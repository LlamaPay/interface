import * as React from 'react';
import {
  createTable,
  getCoreRowModel,
  getPaginationRowModel,
  useTableInstance,
  PaginationState,
} from '@tanstack/react-table';
import Table from 'components/Table';
import { IHistory } from 'types';
import { ActionName, HistoryActions, Amount, SavedName, HistoryAge, EventType } from './CustomValues';
import { downloadHistory } from 'utils/downloadCsv';
import { useTranslations } from 'next-intl';
import { useDialogState } from 'ariakit';
import CustomExportDialog from './CustomValues/CustomExportDialog';

const table = createTable().setRowType<IHistory>();

export function HistoryTable({ data }: { data: IHistory[] }) {
  const t = useTranslations('Table');

  const columns = React.useMemo(
    () => [
      table.createDisplayColumn({
        id: 'action',
        header: t('action'),
        cell: ({ cell }) => cell.row.original && <ActionName data={cell.row.original} />,
      }),
      table.createDisplayColumn({
        id: 'type',
        header: t('type'),
        cell: ({ cell }) =>
          cell.row.original && (
            <EventType event={cell.row.original.eventType} addressType={cell.row.original.addressType} />
          ),
      }),
      table.createDisplayColumn({
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
      }),
      table.createDisplayColumn({
        id: 'amount',
        header: t('amount'),
        cell: ({ cell }) =>
          cell.row.original && <Amount value={cell.row.original.amountPerSec} data={cell.row.original} />,
      }),
      table.createDisplayColumn({
        id: 'age',
        header: t('age'),
        cell: ({ cell }) => cell.row.original && <HistoryAge data={cell.row.original} />,
      }),
      table.createDisplayColumn({
        id: 'historyActions',
        header: '',
        cell: ({ cell }) => cell.row.original && <HistoryActions data={cell.row.original} />,
      }),
    ],
    [t]
  );

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    pageCount: undefined, // allows the table to calculate the page count for us via instance.getPageCount()
  });

  const instance = useTableInstance(table, {
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
