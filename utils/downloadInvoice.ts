import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ISalaryHistory } from '~/queries/salary/useGetSalaryInfo';

export function downloadInvoice(data: ISalaryHistory, locale: string, reqAddress: string) {
  const doc = new jsPDF('portrait', 'mm', 'a4');
  doc.setFontSize(24);
  doc.text('Invoice', 5, 10);
  doc.setFontSize(12);
  doc.text(`Generated for: ${reqAddress}`, 10, 25);
  doc.text(`Paid on: ${new Date(Number(data.createdTimestamp) * 1e3).toLocaleString(locale)}`, 10, 35);

  doc.text('From:', 10, 50);
  doc.text(`${data.stream?.payee.id}`, 15, 55);

  doc.text('Billed To:', 10, 65);
  doc.text(`${data.stream?.payer.id}`, 15, 70);

  doc.text('Payment Method:', 10, 85);
  doc.text(`${data.stream?.token.name ?? ''} (${data.stream?.token.symbol ?? ''})`, 15, 90);

  autoTable(doc, {
    head: [['Description', 'Quantity', 'Amount']],
    margin: { top: 105 },
    body: [
      [
        'Salary Payment',
        '1',
        `${
          data.amount
            ? (Number(data.amount) / 10 ** data.token.decimals).toLocaleString(locale, { maximumFractionDigits: 5 })
            : ''
        } ${data.stream?.token.symbol ?? ''}`,
      ],
    ],
  });

  doc.setFontSize(10);
  doc.text(
    `Total Paid: ${
      data.amount
        ? (Number(data.amount) / 10 ** data.token.decimals).toLocaleString(locale, { maximumFractionDigits: 5 })
        : ''
    } ${data.stream?.token.symbol ?? ''}`,
    130,
    125
  );
  doc.save('invoice.pdf');
}
