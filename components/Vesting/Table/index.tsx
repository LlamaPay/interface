import { ColumnDef, getCoreRowModel, useReactTable, getSortedRowModel, SortingState } from '@tanstack/react-table';
import Table from 'components/Table';
import * as React from 'react';
import { IVesting } from 'types';
import { formatAddress } from 'utils/address';
import { useAccount } from 'wagmi';
import ChartButton from './CustomValues/ChartButton';
import ClaimButton from './CustomValues/ClaimButton';
import ExplorerLink from './CustomValues/ExplorerLink';
import Status, { statusAccessorFn } from './CustomValues/Status';
import Unclaimed from './CustomValues/Unclaimed';

export default function VestingTable({ data }: { data: IVesting[] }) {
  const [{ data: accountData }] = useAccount();

  const columns = React.useMemo<ColumnDef<IVesting>[]>(
    () => [
      {
        accessorFn: (row) => `${row.tokenName} (${row.tokenSymbol})`,
        id: 'token',
        header: 'Token',
        cell: (info) => (
          <ExplorerLink query={info.cell.row.original.token} value={info.getValue() as React.ReactNode} />
        ),
      },
      {
        accessorFn: (row) =>
          accountData?.address.toLowerCase() === row.recipient.toLowerCase() ? row.admin : row.recipient,
        id: 'funderOrRecipient',
        header: 'Funder/Recipient',
        cell: (info) => (
          <ExplorerLink query={info.getValue() as string} value={formatAddress(info.getValue() as string)} />
        ),
        enableSorting: false,
      },
      {
        accessorFn: (row) => Number(row.totalLocked) / 10 ** row.tokenDecimals,
        id: 'total_locked',
        header: 'Total Vesting',
        cell: (info) =>
          info.cell.row.original && (
            <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">
              {info.getValue<number>()?.toFixed(5)}
            </span>
          ),
      },
      {
        accessorFn: (row) => Number(row.totalClaimed) / 10 ** row.tokenDecimals,
        id: 'claimed',
        header: 'Claimed',
        cell: (info) => (
          <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">
            {info.getValue<number>()?.toFixed(5)}
          </span>
        ),
      },
      {
        accessorKey: 'unclaimed',
        header: 'Withdrawable',
        cell: ({ cell }) => cell.row.original && <Unclaimed data={cell.row.original} />,
      },
      {
        accessorFn: (row) => statusAccessorFn(row),
        id: 'status',
        header: 'Status',
        cell: ({ cell }) => cell.row.original && <Status data={cell.row.original} />,
      },
      {
        id: 'claim',
        header: '',
        cell: ({ cell }) => cell.row.original && <ClaimButton data={cell.row.original} />,
      },
      {
        id: 'chart',
        header: '',
        cell: ({ cell }) => cell.row.original && <ChartButton data={cell.row.original} />,
      },
      {
        id: 'viewContract',
        header: '',
        cell: ({ cell }) =>
          cell.row.original && (
            <ExplorerLink
              query={cell.row.original.contract}
              value={<span className="row-action-links font-exo float-right dark:text-white">Contract</span>}
            />
          ),
      },
    ],
    [accountData]
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
    debugTable: true,
  });

  return <Table instance={instance} hidePagination={true} maxWidthColumn={7} />;
}
