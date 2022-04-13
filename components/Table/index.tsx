/* eslint-disable react/jsx-key */
import { TableInstance } from '@tanstack/react-table';

const Table = ({ instance }: { instance: TableInstance<any> }) => {
  return (
    <table {...instance.getTableProps()} className="w-full">
      <thead>
        {instance.getHeaderGroups().map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((header) => (
              <th {...header.getHeaderProps()} className="whitespace-nowrap text-left text-sm font-semibold">
                {header.isPlaceholder ? null : header.renderHeader()}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...instance.getTableBodyProps()}>
        {instance.getRowModel().rows.map((row) => (
          <tr {...row.getRowProps()}>
            {row.getVisibleCells().map((cell) => (
              <td {...cell.getCellProps()} className="truncate whitespace-nowrap text-sm">
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
  );
};

export default Table;
