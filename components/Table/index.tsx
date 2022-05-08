import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { TableInstance } from '@tanstack/react-table';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

interface ITableProps {
  instance: TableInstance<any>;
  maxWidthColumn?: number;
  hidePagination?: boolean;
  downloadToCSV?: () => void;
}

const Table = ({ instance, maxWidthColumn, hidePagination, downloadToCSV }: ITableProps) => {
  const totalRows = instance.getCoreRowModel().rows.length;

  const currentRows = instance.getRowModel().rows;

  const firstRowId = Number(currentRows[0]?.id) + 1;
  const lastRowId = Number(currentRows[currentRows.length - 1]?.id) + 1;

  const showRowNumber = !Number.isNaN(firstRowId) && !Number.isNaN(lastRowId);

  const t = useTranslations('Table');

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table>
          <thead>
            {instance.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="whitespace-nowrap py-[6px] px-4 text-left text-sm font-semibold text-[#3D3D3D] dark:text-white"
                  >
                    {header.isPlaceholder ? null : header.renderHeader()}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {instance.getRowModel().rows.map((row) => (
              <tr key={row.id} className="table-row">
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    className={classNames(
                      'table-description',
                      index + 1 === maxWidthColumn && 'w-full text-right',
                      maxWidthColumn && index + 1 > maxWidthColumn && 'border-l-0'
                    )}
                  >
                    {cell.renderCell()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <>
        <div className={hidePagination ? 'h-4' : 'h-2'} />
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between sm:gap-5">
          <div className="flex flex-1 items-center justify-between gap-2">
            {downloadToCSV && (
              <button className="bg-none text-xs text-[#303030] underline dark:text-white" onClick={downloadToCSV}>
                {t('exportCSV')}
              </button>
            )}
            {!hidePagination && (
              <label className="flex items-center space-x-1">
                <span className="text-xs text-[rgba(0,0,0,0.54)] dark:text-white">{`${t('rowsPerPage')}:`}</span>
                <select
                  value={instance.getState().pagination.pageSize}
                  onChange={(e) => {
                    instance.setPageSize(Number(e.target.value));
                  }}
                  className="border-0 pr-6 text-xs text-[#333336] dark:bg-[#202020] dark:text-white"
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          {!hidePagination && (
            <div className="flex items-center justify-between space-x-8 pr-1 text-[rgba(0,0,0,0.87)] dark:text-white">
              {showRowNumber && <span className="text-xs">{`${firstRowId} - ${lastRowId} of ${totalRows}`}</span>}
              <span className="space-x-5">
                <button
                  className="rounded p-1"
                  onClick={() => instance.previousPage()}
                  disabled={!instance.getCanPreviousPage()}
                  aria-disabled={!instance.getCanPreviousPage()}
                >
                  <span className="sr-only">{t('previous')}</span>
                  <ChevronLeftIcon className="h-6 dark:text-white" color="#333336" />
                </button>
                <button
                  className="rounded p-1"
                  onClick={() => instance.nextPage()}
                  disabled={!instance.getCanNextPage()}
                  aria-disabled={!instance.getCanNextPage()}
                >
                  <span className="sr-only">{t('next')}</span>
                  <ChevronRightIcon className="h-6 dark:text-white" color="#333336" />
                </button>
              </span>
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default Table;
