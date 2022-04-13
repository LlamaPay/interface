import * as React from 'react';
import { createTable, useTable, PaginationState, paginateRowsFn } from '@tanstack/react-table';
import Table from 'components/Table';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { IHistory } from 'types';
import { secondsByDuration } from 'utils/constants';
import { formatAddress } from 'utils/address';
import { formatAmountInHistory } from 'utils/amount';
import ActionName from './ActionName';

const table = createTable<{ Row: IHistory }>();

const defaultColumns = table.createColumns([
  table.createDataColumn('eventType', {
    header: 'Action',
    cell: ({ value }) => <ActionName name={value} />,
  }),
  table.createDataColumn('addressRelated', {
    header: 'Address related',
    cell: ({ value }) => <>{value && formatAddress(value)}</>,
  }),
  table.createDataColumn('amountPerSec', {
    header: () => (
      <>
        <span>Amount</span>
        <small className="mx-1 text-xs font-normal text-gray-500 dark:text-gray-400">per month</small>
      </>
    ),
    cell: ({ value }) => {
      const isDataValid = !Number.isNaN(value);
      const amount = isDataValid && formatAmountInHistory(Number(value) / 1e20, secondsByDuration['month']);

      return <>{amount}</>;
    },
  }),
]);

export function HistoryTable() {
  const { data: streamsAndHistory, isLoading, error } = useStreamsAndHistory();

  if (isLoading || error) {
    // TODO show placeholder
    return null;
  }

  return (
    <div className="w-full overflow-x-auto">
      <NewTable data={streamsAndHistory.history || []} />
    </div>
  );
}

function NewTable({ data }: { data: IHistory[] }) {
  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    pageCount: -1, // -1 allows the table to calculate the page count for us via instance.getPageCount()
  });

  const instance = useTable(table, {
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    paginateRowsFn: paginateRowsFn,
  });

  return <Table instance={instance} />;
}
