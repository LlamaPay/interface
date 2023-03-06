import type { ISubscriptionHistoryEvent } from '~/queries/useGetSubscriptions';
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
import Table from '~/components/Table';
import { useIntl, useTranslations } from 'next-intl';
import { networkDetails } from '~/lib/networkDetails';
import { useNetwork } from 'wagmi';
import { formatAddress } from '~/utils/address';
import Tooltip from '../Tooltip';
import { eventAgeFormatter } from '../History/Table/CustomValues';

export function SubscriptionsHistoryTable({ data }: { data: Array<ISubscriptionHistoryEvent> }) {
  const t = useTranslations('Table');

  const { chain } = useNetwork();

  const explorerUrl = chain ? networkDetails[chain.id]?.blockExplorerURL : null;
  const explorerName = chain ? networkDetails[chain.id]?.blockExplorerName : null;

  const intl = useIntl();

  const columns = React.useMemo<ColumnDef<ISubscriptionHistoryEvent>[]>(
    () => [
      {
        id: 'eventType',
        header: t('type'),
        cell: ({ cell }) => <p className="dark:text-white">{cell.row.original.eventType}</p>,
      },
      {
        id: 'contractType',
        header: 'Contract Type',
        cell: ({ cell }) => {
          const type = cell.row.original.nonRefundableContract
            ? 'Non Refundanle'
            : cell.row.original.refundableContract
            ? 'Refundable'
            : null;

          return type;
        },
      },
      {
        id: 'contractAddress',
        header: 'Contract Address',
        cell: ({ cell }) => {
          const address =
            cell.row.original.nonRefundableContract?.address ?? cell.row.original.refundableContract?.address ?? null;

          if (!address) return;

          return (
            <a
              href={`${explorerUrl}/address/${address}`}
              target="_blank"
              rel="noreferrer noopener"
              className="row-action-links text-right dark:text-white"
            >
              {formatAddress(address)}
            </a>
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
      {
        id: 'txHash',
        header: '',
        cell: ({ cell }) => {
          return (
            <a
              href={`${explorerUrl}/tx/${cell.row.original.txHash}`}
              target="_blank"
              rel="noreferrer noopener"
              className="row-action-links text-right dark:text-white"
            >
              {`Show on ${explorerName}`}
            </a>
          );
        },
      },
    ],
    [t, explorerUrl, explorerName]
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

  return <Table instance={instance} />;
}
