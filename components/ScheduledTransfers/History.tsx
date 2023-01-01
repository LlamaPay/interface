import * as React from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import type { IScheduledTransferHistory } from '~/queries/useGetScheduledTransfers';
import { useIntl, useTranslations } from 'next-intl';
import Table from '~/components/Table';
import { formatAddress } from '~/utils/address';
import { useNetwork } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';
import { eventAgeFormatter } from '~/components/History/Table/CustomValues';
import Tooltip from '~/components/Tooltip';

export function ScheduledTransfersHistory({
  history,
  isPoolOwnersHistory,
}: {
  history: Array<IScheduledTransferHistory>;
  isPoolOwnersHistory?: boolean;
}) {
  const t = useTranslations('Table');

  const [{ data: networkData }] = useNetwork();

  const explorerUrl = networkData?.chain?.id ? networkDetails[networkData.chain.id]?.blockExplorerURL : null;

  const intl = useIntl();

  const columns = React.useMemo<ColumnDef<IScheduledTransferHistory>[]>(
    () => [
      {
        id: 'eventType',
        header: t('type'),
        cell: ({ cell }) => cell.row.original.eventType,
      },
      {
        id: 'addressName',
        header: t('addressName'),
        cell: ({ cell }) => {
          const address = isPoolOwnersHistory ? cell.row.original.to : cell.row.original.pool.owner;

          if (!address) {
            return;
          }

          return (
            <a href={`${explorerUrl}/address/${address}`} target="_blank" rel="noreferrer noopener">
              {formatAddress(address)}
            </a>
          );
        },
      },
      {
        id: 'usdAmount',
        header: t('amount'),
        cell: ({ cell }) => {
          const amount = cell.row.original.usdAmount;

          if (!amount) {
            return;
          }

          return (
            <>{`$${(Number(amount) / 1e8).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}`}</>
          );
        },
      },
      {
        id: 'createdTimestamp',
        header: t('age'),
        cell: ({ cell }) => {
          const createdTimestamp = cell.row.original.createdTimestamp;

          return (
            <Tooltip
              content={intl.formatDateTime(new Date(Number(createdTimestamp) * 1e3), {
                hour12: false,
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            >
              <a
                href={`${explorerUrl}/tx/${cell.row.original.txHash}`}
                target="_blank"
                rel="noreferrer noopener"
                className="dark:text-white"
              >
                {eventAgeFormatter(createdTimestamp)}
              </a>
            </Tooltip>
          );
        },
      },
    ],
    [t, isPoolOwnersHistory, explorerUrl, intl]
  );

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const instance = useReactTable({
    data: history,
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

  return <Table instance={instance} />;
}
