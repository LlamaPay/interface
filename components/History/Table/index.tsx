import * as React from 'react';
import { createTable, useTable } from '@tanstack/react-table';
import Table from 'components/Table';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { IHistory } from 'types';

const table = createTable<{ Row: IHistory }>();

const defaultColumns = table.createColumns([]);

export function HistoryTable() {
  const { data: streamsAndHistory, isLoading, error } = useStreamsAndHistory();

  const data = React.useMemo(() => {
    return streamsAndHistory.streams || [];
  }, [streamsAndHistory]);

  if (isLoading || error) {
    // TODO show placeholder
    return null;
  }

  return (
    <div className="w-full overflow-x-auto">
      <NewTable data={data} />
    </div>
  );
}

function NewTable({ data }: { data: IHistory[] }) {
  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns]);

  const instance = useTable(table, {
    data,
    columns,
  });

  return <Table instance={instance} />;
}
