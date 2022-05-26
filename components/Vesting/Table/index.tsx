import { createTable, getCoreRowModel, useTableInstance } from '@tanstack/react-table';
import Table from 'components/Table';
import { useNetworkProvider } from 'hooks';
import React from 'react';
import { IVesting } from 'types';
import { formatAddress } from 'utils/address';
import { networkDetails } from 'utils/constants';
import ClaimButton from './CustomValues/ClaimButton';
import Unclaimed from './CustomValues/Unclaimed';

const table = createTable().setRowType<IVesting>();

export function VestingTable({ data }: { data: IVesting[] }) {
  const { chainId } = useNetworkProvider();
  const explorerUrl = chainId ? networkDetails[chainId].blockExplorerURL : '';
  const columns = React.useMemo(
    () => [
      table.createDisplayColumn({
        id: 'token',
        header: 'Token',
        cell: ({ cell }) =>
          cell.row.original && (
            <a
              href={`${explorerUrl}/address/${cell.row.original.token}`}
              target="_blank"
              rel="noreferrer noopener"
              className="text-center dark:text-white"
            >{`${cell.row.original.tokenName}`}</a>
          ),
      }),
      table.createDisplayColumn({
        id: 'funder',
        header: 'Funder',
        cell: ({ cell }) =>
          cell.row.original && (
            <a
              href={`${explorerUrl}/address/${cell.row.original.admin}`}
              target="_blank"
              rel="noreferrer noopener"
              className="text-center dark:text-white "
            >
              {formatAddress(cell.row.original.admin)}
            </a>
          ),
      }),
      table.createDisplayColumn({
        id: 'recipient',
        header: 'Recipient',
        cell: ({ cell }) =>
          cell.row.original && (
            <a
              href={`${explorerUrl}/address/${cell.row.original.recipient}`}
              target="_blank"
              rel="noreferrer noopener"
              className="text-center dark:text-white"
            >
              {formatAddress(cell.row.original.recipient)}
            </a>
          ),
      }),
      table.createDisplayColumn({
        id: 'total_locked',
        header: 'Total Vested',
        cell: ({ cell }) =>
          cell.row.original && (
            <span className="text-center dark:text-white">
              {`${(Number(cell.row.original.totalLocked) / 10 ** cell.row.original.tokenDecimals).toFixed(5)} ${
                cell.row.original.tokenSymbol
              }`}
            </span>
          ),
      }),
      table.createDisplayColumn({
        id: 'claimed',
        header: 'Claimed',
        cell: ({ cell }) =>
          cell.row.original && (
            <span className="text-center dark:text-white">{`${(
              Number(cell.row.original.totalClaimed) /
              10 ** cell.row.original.tokenDecimals
            ).toFixed(5)} ${cell.row.original.tokenSymbol}`}</span>
          ),
      }),
      table.createDisplayColumn({
        id: 'unclaimed',
        header: 'Unclaimed',
        cell: ({ cell }) => cell.row.original && <Unclaimed data={cell.row.original} />,
      }),
      table.createDisplayColumn({
        id: 'claim',
        header: '',
        cell: ({ cell }) => cell.row.original && <ClaimButton data={cell.row.original} />,
      }),
    ],
    [explorerUrl]
  );
  const instance = useTableInstance(table, {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table instance={instance} hidePagination={true} maxWidthColumn={7} />;
}
