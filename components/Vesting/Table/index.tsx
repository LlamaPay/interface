import { createTable, getCoreRowModel, useTableInstance } from '@tanstack/react-table';
import Table from 'components/Table';
import { useNetworkProvider } from 'hooks';
import React from 'react';
import { IVesting } from 'types';
import { networkDetails } from 'utils/constants';
import ClaimButton from './CustomValues/ClaimButton';
import FunderOrRecipient from './CustomValues/FunderOrRecipient';
import Status from './CustomValues/Status';
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
              className="font-exo text-center dark:text-white"
            >{`${cell.row.original.tokenName}`}</a>
          ),
      }),
      table.createDisplayColumn({
        id: 'funderOrRecipient',
        header: 'Funder/Recipient',
        cell: ({ cell }) => cell.row.original && <FunderOrRecipient data={cell.row.original} />,
      }),
      table.createDisplayColumn({
        id: 'total_locked',
        header: 'Total Vested',
        cell: ({ cell }) =>
          cell.row.original && (
            <span className="font-exo text-center dark:text-white">
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
            <span className="font-exo text-center dark:text-white">{`${(
              Number(cell.row.original.totalClaimed) /
              10 ** cell.row.original.tokenDecimals
            ).toFixed(5)} ${cell.row.original.tokenSymbol}`}</span>
          ),
      }),
      table.createDisplayColumn({
        id: 'unclaimed',
        header: 'Withdrawable',
        cell: ({ cell }) => cell.row.original && <Unclaimed data={cell.row.original} />,
      }),
      table.createDisplayColumn({
        id: 'status',
        header: 'Status',
        cell: ({ cell }) => cell.row.original && <Status data={cell.row.original} />,
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
