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

export const downloadStreams = (
  data: IStream[],
  names: {
    id: string;
    shortName: string;
  }[]
) => {
  const rows = [
    [
      'Payer Name',
      'Payer Address',
      'Payee Name',
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
    let payerName = names.find((e) => e.id === d.payerAddress)?.shortName;
    let payeeName = names.find((e) => e.id === d.payeeAddress)?.shortName;
    if (payerName === undefined) payerName = '';
    if (payeeName === undefined) payeeName = '';
    rows.push([
      payerName,
      d.payerAddress,
      payeeName,
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
  const rows = [['Address Related', 'Transaction Hash', 'Event Type', 'Amount Per Sec/Amount', 'Timestamp']];

  data.forEach((d) => {
    rows.push([d.addressRelated, d.txHash, d.eventType, d.amountPerSec, d.createdTimestamp]);
  });

  download('history.csv', rows.map((r) => r.join(',')).join('\n'));
};

export const downloadCustomHistory = (
  data: IHistory[],
  dateRange: { start: string; end: string },
  eventType: string | null
) => {
  const rows = [['Address Related', 'Transaction Hash', 'Event Type', 'Amount Per Sec/Amount', 'Timestamp']];
  const startTimestamp = Number(new Date(dateRange.start)) / 1e3;
  const endTimestamp = Number(new Date(dateRange.end)) / 1e3;
  data.forEach((d) => {
    if (Number(d.createdTimestamp) > endTimestamp || Number(d.createdTimestamp) < startTimestamp) return;
    if (!eventType) {
      rows.push([d.addressRelated, d.txHash, d.eventType, d.amountPerSec, d.createdTimestamp]);
    } else if (eventType === d.eventType) {
      rows.push([d.addressRelated, d.txHash, d.eventType, d.amountPerSec, d.createdTimestamp]);
    }
  });
  download('history.csv', rows.map((r) => r.join(',')).join('\n'));
};
