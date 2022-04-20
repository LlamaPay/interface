import { IHistory, IStream } from 'types';
import { secondsByDuration } from './constants';

export function download(filename: string, text: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export const downloadStreams = (data: IStream[]) => {
  const rows = [
    [
      'Payer Address',
      'Payee Address',
      'Token Address',
      'Token Name',
      'Contract Address',
      'Amount Per Sec',
      'Amount Per Month',
      'Timestamp',
    ],
  ];

  data.forEach((d) => {
    rows.push([
      d.payerAddress,
      d.payeeAddress,
      d.token.address,
      d.token.name,
      d.llamaContractAddress,
      d.amountPerSec,
      ((Number(d.amountPerSec) * secondsByDuration['month']) / 1e20).toString(),
      d.createdTimestamp,
    ]);
  });

  download('streams.csv', rows.map((r) => r.join(',')).join('\n'));
};

export const downloadHistory = (data: IHistory[]) => {
  const rows = [['Address Related', 'Transaction Hash', 'Event Type', 'Amount Per Sec', 'Timestamp']];

  data.forEach((d) => {
    rows.push([d.addressRelated, d.txHash, d.eventType, d.amountPerSec, d.createdTimestamp]);
  });

  download('history.csv', rows.map((r) => r.join(',')).join('\n'));
};
