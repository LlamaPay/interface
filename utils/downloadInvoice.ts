import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IHistory } from 'types';

export function downloadInvoice(data: IHistory[], locale: string, reqAddress: string) {
  const doc = new jsPDF('landscape', 'px', 'a4');
  doc.setFontSize(12);
  doc.text(`Invoice for: ${reqAddress}`, 30, 25);
  doc.text(`Generated: ${new Date(Date.now()).toLocaleString(locale)}`, 30, 35);

  const tableBody: string[][] = [];

  data.forEach((p) => {
    if (p.eventType !== 'Withdraw') return;
    tableBody.push([
      p.stream?.token.name ?? '',
      p.addressType === 'payer' ? 'Send' : 'Receive',
      p.stream?.payer.id ?? '',
      p.stream?.payee.id ?? '',
      (p.amount / 10 ** Number(p.stream?.token.decimals)).toLocaleString(locale, {
        maximumFractionDigits: 5,
      }),
      new Date(p.createdTimestamp * 1e3).toLocaleString(locale, {
        hour12: false,
      }),
    ]);
  });

  autoTable(doc, {
    head: [['Token', 'Type', 'Sender', 'Receiver', 'Amount', 'Time']],
    margin: { top: 40 },
    body: tableBody,
  });

  doc.save('invoice.pdf');
}
