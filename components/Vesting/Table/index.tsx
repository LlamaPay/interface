import * as React from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { DisclosureState } from 'ariakit';
import Table from '~/components/Table';
import type { IVesting } from '~/types';
import { formatAddress } from '~/utils/address';
import { useAccount } from 'wagmi';
import type { IChartValues } from '../types';
import ChartButton from './CustomValues/ChartButton';
import ClaimButton from './CustomValues/ClaimButton';
import ExplorerLink from './CustomValues/ExplorerLink';
import Status, { statusAccessorFn } from './CustomValues/Status';
import Unclaimed from './CustomValues/Unclaimed';
import RugpullVestingButton from './CustomValues/RugpullVestingButton';
import { useLocale } from '~/hooks';
import { downloadVesting } from '~/utils/downloadCsv';
import ReasonButton from './CustomValues/ReasonButton';
import RenounceOwnershipButton from './CustomValues/RenounceOwnershipButton';
import Vested from './CustomValues/Vested';
import useDebounce from '~/hooks/useDebounce';
import MigrateButton from './CustomValues/Migrate';

export default function VestingTable({
  data,
  chartValues,
  chartDialog,
  claimDialog,
  claimValues,
}: {
  data: IVesting[];
  chartValues: React.MutableRefObject<IChartValues | null>;
  chartDialog: DisclosureState;
  claimDialog: DisclosureState;
  claimValues: React.MutableRefObject<IVesting | null>;
}) {
  const { address } = useAccount();
  const { locale } = useLocale();

  let columns = React.useMemo<ColumnDef<IVesting>[]>(
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
          address && address.toLowerCase() === row.recipient.toLowerCase() ? row.admin : row.recipient,
        id: 'funderOrRecipient',
        header: 'Funder/Recipient',
        cell: (info) => (
          <ExplorerLink query={info.getValue() as string} value={formatAddress(info.getValue() as string)} />
        ),
        enableSorting: false,
      },
      {
        accessorFn: (row) => String(Number(row.totalLocked) / 10 ** row.tokenDecimals),
        id: 'total_locked',
        header: 'Total Vesting',
        cell: (info) =>
          info.cell.row.original && (
            <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">
              {Number(info.getValue<string>())?.toLocaleString(locale, {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              })}
            </span>
          ),
      },
      {
        id: 'total_vested',
        header: 'Total Vested',
        cell: (info) => info.cell.row.original && <Vested data={info.row.original} />,
      },
      {
        accessorFn: (row) => String(Number(row.totalClaimed) / 10 ** row.tokenDecimals),
        id: 'claimed',
        header: 'Claimed',
        cell: (info) => (
          <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">
            {Number(info.getValue<string>())?.toLocaleString(locale, {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })}
          </span>
        ),
      },
      {
        accessorKey: 'unclaimed',
        header: 'Withdrawable',
        cell: ({ cell }) => cell.row.original && <Unclaimed data={cell.row.original} />,
      },
      {
        accessorFn: (row) => row.reason || 'N/A',
        id: 'reason',
        header: 'Reason',
        cell: (info) => <p>{info.getValue<string>()}</p>,
      },
      {
        accessorFn: (row) => String(statusAccessorFn(row)),
        id: 'status',
        header: 'Status',
        cell: ({ cell }) => cell.row.original && <Status data={cell.row.original} />,
      },
      {
        id: 'claim',
        header: '',
        cell: ({ cell }) =>
          cell.row.original && (
            <ClaimButton data={cell.row.original} claimDialog={claimDialog} claimValues={claimValues} />
          ),
      },
      {
        id: 'migrate',
        header: '',
        cell: ({ cell }) => (cell.row.original ? <MigrateButton data={cell.row.original} allStreams={data} /> : null),
      },
      {
        id: 'addReason',
        header: '',
        cell: ({ cell }) => cell.row.original && <ReasonButton data={cell.row.original} />,
      },
      {
        id: 'renounce',
        header: '',
        cell: ({ cell }) =>
          cell.row.original && <RenounceOwnershipButton data={cell.row.original}></RenounceOwnershipButton>,
      },
      {
        id: 'rug',
        header: '',
        cell: ({ cell }) => cell.row.original && <RugpullVestingButton data={cell.row.original} />,
      },
      {
        id: 'chart',
        header: '',
        cell: ({ cell }) =>
          cell.row.original && <ChartButton data={cell.row.original} chartValues={chartValues} dialog={chartDialog} />,
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
    [address, chartValues, chartDialog, claimDialog, claimValues, locale, data]
  );

  const [tableFilter, setTableFilter] = React.useState('');
  const globalFilter = useDebounce(tableFilter, 300);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const hasReason = data.some((e) => e.reason !== null);
  if (!hasReason) {
    columns = columns.filter((e) => e.id !== 'reason');
  }
  const instance = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const downloadToCSV = React.useCallback(() => downloadVesting(data), [data]);

  return (
    <>
      <input
        name="search table"
        placeholder="Search..."
        className="mb-1 rounded border border-lp-gray-1 bg-lp-white px-3 py-1 slashed-zero placeholder:text-sm placeholder:text-lp-gray-2 dark:border-transparent dark:bg-lp-gray-5"
        value={tableFilter}
        onChange={(e) => setTableFilter(e.target.value)}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
      />
      <Table instance={instance} hidePagination={true} maxWidthColumn={7} downloadToCSV={downloadToCSV} />
    </>
  );
}
