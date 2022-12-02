import { ColumnDef, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import Table from 'components/Table';
import ExplorerLink from 'components/Vesting/Table/CustomValues/ExplorerLink';
import { useLocale } from 'hooks';
import * as React from 'react';
import { IPayments } from 'types';
import { formatAddress } from 'utils/address';
import { useAccount } from 'wagmi';
import PaymentRevokeButton from './CustomValues/PaymentRevoke';
import PaymentStatus, { paymentStatusAccessorFn } from './CustomValues/PaymentStatus';

export default function PaymentsTableActual({ data }: { data: any }) {
  const [{ data: accountData }] = useAccount();
  const { locale } = useLocale();
  const columns = React.useMemo<ColumnDef<IPayments>[]>(
    () => [
      {
        accessorFn: (row) => `${row.tokenName} (${row.tokenSymbol})`,
        id: 'token',
        header: 'Token',
        cell: (i) => <ExplorerLink query={i.cell.row.original.tokenAddress} value={i.getValue() as React.ReactNode} />,
      },
      {
        accessorFn: (row) => (accountData?.address.toLowerCase() === row.payee.toLowerCase() ? row.payer : row.payee),
        id: 'payerOrPayee',
        header: 'Payer/Payee',
        cell: (i) => <ExplorerLink query={i.getValue() as string} value={formatAddress(i.getValue() as string)} />,
      },
      {
        accessorFn: (row) => row.amount / 10 ** row.tokenDecimals,
        id: 'amount',
        header: 'Amount',
        cell: (i) =>
          i.cell.row.original && (
            <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">
              {i.getValue<number>()?.toLocaleString(locale, { minimumFractionDigits: 5, maximumFractionDigits: 5 })}
            </span>
          ),
      },
      {
        id: 'releases',
        header: 'Releases',
        cell: (i) =>
          i.row.original && (
            <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">
              {new Date(i.row.original.release * 1e3).toLocaleString(locale)}
            </span>
          ),
      },
      {
        accessorFn: (row) => paymentStatusAccessorFn(row),
        id: 'status',
        header: 'Status',
        cell: (i) => i.row.original && <PaymentStatus data={i.row.original} />,
      },
      {
        id: 'revoke',
        header: '',
        cell: (i) => i.row.original && <PaymentRevokeButton data={i.row.original} />,
      },
    ],
    []
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

  return <Table instance={instance} hidePagination={true} />;
}
