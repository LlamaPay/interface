import { createTable, getCoreRowModel, useTableInstance } from '@tanstack/react-table';
import Table from 'components/Table';
import React from 'react';
import { IVesting } from 'types';

const table = createTable().setRowType<IVesting>();

export function VestingTable({ data }: { data: IVesting[] }) {
  const columns = React.useMemo(
    () => [
      table.createDisplayColumn({
        id: 'token',
        header: 'Token',
        cell: ({ cell }) => cell.row.original && <p>uwu</p>,
      }),
      table.createDisplayColumn({
        id: 'funder',
        header: 'Funder',
        cell: ({ cell }) => cell.row.original && <p>uwu</p>,
      }),
      table.createDisplayColumn({
        id: 'claimed',
        header: 'Claimed',
        cell: ({ cell }) => cell.row.original && <p>uwu</p>,
      }),
      table.createDisplayColumn({
        id: 'unclaimed',
        header: 'Unclaimed',
        cell: ({ cell }) => cell.row.original && <p>uwu</p>,
      }),
      table.createDisplayColumn({
        id: 'ends',
        header: 'Ends',
        cell: ({ cell }) => cell.row.original && <p>uwu</p>,
      }),
    ],
    []
  );
  const instance = useTableInstance(table, {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table instance={instance} hidePagination={true} maxWidthColumn={7} />;
}
