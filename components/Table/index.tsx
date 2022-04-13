/* eslint-disable react/jsx-key */
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { TableInstance } from '@tanstack/react-table';

const Table = ({ instance }: { instance: TableInstance<any> }) => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table {...instance.getTableProps()} className="">
          <thead>
            {instance.getHeaderGroups().map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((header) => (
                  <th
                    {...header.getHeaderProps()}
                    className="whitespace-nowrap py-[6px] px-2 text-left text-sm font-semibold first-of-type:pl-1"
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
                className="bg-white odd:bg-neutral-100 dark:bg-neutral-900 dark:odd:bg-neutral-800"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="truncate whitespace-nowrap border-l-[1px] border-dashed border-gray-200 px-4 py-[6px] text-sm first-of-type:border-l-0 first-of-type:pl-1 last-of-type:w-full dark:border-gray-700"
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
      <div className="h-2" />
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between sm:gap-5">
        <div className="flex flex-1 items-center justify-between gap-2">
          <button className="bg-none text-xs underline">Export CSV</button>
          <label className="flex items-center space-x-1">
            <span className="text-xs opacity-70">Rows per page:</span>
            <select
              value={instance.getState().pagination.pageSize}
              onChange={(e) => {
                instance.setPageSize(Number(e.target.value));
              }}
              className="border-0 pr-6 text-xs dark:bg-black"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-center justify-between space-x-8">
          <span className="text-xs">{`1 - ${instance.getRowModel().rows.length} of ${
            instance.getCoreRowModel().rows.length
          }`}</span>
          <span className="space-x-5">
            <button
              className="rounded p-1"
              onClick={() => instance.previousPage()}
              disabled={!instance.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-6" />
            </button>
            <button className="rounded p-1" onClick={() => instance.nextPage()} disabled={!instance.getCanNextPage()}>
              <ChevronRightIcon className="h-6" />
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Table;
