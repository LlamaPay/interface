import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { TableInstance } from '@tanstack/react-table';

interface ITableProps {
  instance: TableInstance<any>;
  hidePagination?: boolean;
  downloadToCSV: () => void;
}

const Table = ({ instance, hidePagination, downloadToCSV }: ITableProps) => {
  const totalRows = instance.getCoreRowModel().rows.length;

  const currentRows = instance.getRowModel().rows;

  const firstRowId = Number(currentRows[0]?.id) + 1;
  const lastRowId = Number(currentRows[currentRows.length - 1]?.id) + 1;

  const showRowNumber = !Number.isNaN(firstRowId) && !Number.isNaN(lastRowId);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table {...instance.getTableProps()} className="">
          <thead>
            {instance.getHeaderGroups().map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    {...header.getHeaderProps()}
                    key={header.id}
                    className="whitespace-nowrap py-[6px] px-4 text-left text-sm font-semibold text-[#3D3D3D]"
                  >
                    {header.isPlaceholder ? null : header.renderHeader()}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...instance.getTableBodyProps()}>
            {instance.getRowModel().rows.map((row) => (
              <tr
                {...row.getRowProps()}
                key={row.id}
                className="bg-white odd:bg-neutral-100 dark:bg-neutral-900 dark:odd:bg-neutral-800"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    key={cell.id}
                    className="truncate whitespace-nowrap border-l-[1px] border-dashed border-gray-200 px-4 py-[6px] text-sm text-[#3D3D3D] first-of-type:border-l-0 last-of-type:w-full dark:border-gray-700"
                  >
                    {cell.renderCell()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {/* <tfoot>
        {instance.getFooterGroups().map((footerGroup) => (
          <tr {...footerGroup.getFooterGroupProps()}>
            {footerGroup.headers.map((header) => (
              <th {...header.getFooterProps()}>{header.isPlaceholder ? null : header.renderFooter()}</th>
            ))}
          </tr>
        ))}
      </tfoot> */}
        </table>
      </div>

      <>
        <div className="h-2" />
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between sm:gap-5">
          <div className="flex flex-1 items-center justify-between gap-2">
            <button className="bg-none text-xs text-[#303030] underline" onClick={downloadToCSV}>
              Export CSV
            </button>
            {!hidePagination && (
              <label className="flex items-center space-x-1">
                <span className="text-xs text-[rgba(0,0,0,0.54)]">Rows per page:</span>
                <select
                  value={instance.getState().pagination.pageSize}
                  onChange={(e) => {
                    instance.setPageSize(Number(e.target.value));
                  }}
                  className="border-0 pr-6 text-xs text-[#333336] dark:bg-black"
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
            <div className="flex items-center justify-between space-x-8 pr-1 text-[rgba(0,0,0,0.87)]">
              {showRowNumber && <span className="text-xs">{`${firstRowId} - ${lastRowId} of ${totalRows}`}</span>}
              <span className="space-x-5">
                <button
                  className="rounded p-1"
                  onClick={() => instance.previousPage()}
                  disabled={!instance.getCanPreviousPage()}
                  aria-disabled={!instance.getCanPreviousPage()}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-6" color="#333336" />
                </button>
                <button
                  className="rounded p-1"
                  onClick={() => instance.nextPage()}
                  disabled={!instance.getCanNextPage()}
                  aria-disabled={!instance.getCanNextPage()}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-6" color="#333336" />
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
