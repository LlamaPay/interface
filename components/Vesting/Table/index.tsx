import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Table from 'components/Table';
import { useNetworkProvider } from 'hooks';
import React from 'react';
import { IVesting } from 'types';
import { networkDetails } from 'utils/constants';
import ChartButton from './CustomValues/ChartButton';
import ClaimButton from './CustomValues/ClaimButton';
import FunderOrRecipient from './CustomValues/FunderOrRecipient';
import Status from './CustomValues/Status';
import Unclaimed from './CustomValues/Unclaimed';

export default function VestingTable({ data }: { data: IVesting[] }) {
  const { chainId } = useNetworkProvider();

  const explorerUrl = chainId ? networkDetails[chainId].blockExplorerURL : '';

  const columns = React.useMemo<ColumnDef<IVesting>[]>(
    () => [
      {
        id: 'token',
        header: 'Token',
        cell: ({ cell }) =>
          cell.row.original && (
            <a
              href={
                chainId === 82 || chainId === 1088
                  ? `${explorerUrl}address/${cell.row.original.token}`
                  : `${explorerUrl}/address/${cell.row.original.token}`
              }
              target="_blank"
              rel="noreferrer noopener"
              className="font-exo text-center dark:text-white"
            >{`${cell.row.original.tokenName} (${cell.row.original.tokenSymbol})`}</a>
          ),
      },
      {
        id: 'funderOrRecipient',
        header: 'Funder/Recipient',
        cell: ({ cell }) => cell.row.original && <FunderOrRecipient data={cell.row.original} />,
      },
      {
        id: 'total_locked',
        header: 'Total Vesting',
        cell: ({ cell }) =>
          cell.row.original && (
            <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">
              {`${(Number(cell.row.original.totalLocked) / 10 ** cell.row.original.tokenDecimals).toFixed(5)}`}
            </span>
          ),
      },
      {
        id: 'claimed',
        header: 'Claimed',
        cell: ({ cell }) =>
          cell.row.original && (
            <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">{`${(
              Number(cell.row.original.totalClaimed) /
              10 ** cell.row.original.tokenDecimals
            ).toFixed(5)}`}</span>
          ),
      },
      {
        id: 'unclaimed',
        header: 'Withdrawable',
        cell: ({ cell }) => cell.row.original && <Unclaimed data={cell.row.original} />,
      },
      {
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
            <a
              href={
                chainId === 82 || chainId === 1088
                  ? `${explorerUrl}address/${cell.row.original.contract}`
                  : `${explorerUrl}/address/${cell.row.original.contract}`
              }
              target="_blank"
              rel="noreferrer noopener"
              className="row-action-links font-exo dark:text-white"
            >
              {'Contract'}
            </a>
          ),
      },
    ],
    [explorerUrl, chainId]
  );

  const instance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table instance={instance} hidePagination={true} maxWidthColumn={7} />;
}
