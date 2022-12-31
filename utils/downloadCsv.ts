import type { IHistory, IStream, IVesting } from '~/types';
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
  const rows = [['Address Related', 'Transaction Hash', 'Event Type', 'Amount Per Month/Amount', 'Timestamp']];

  data.forEach((d) => {
    rows.push([
      d.addressRelated,
      d.txHash,
      d.eventType,
      d.eventType === 'Withdraw' || 'Deposit' || 'PayerWithdraw'
        ? Number(d.amount) / 10 ** Number(d.token.decimals)
        : (Number(d.amountPerSec) / 1e20) * secondsByDuration['month'],
      d.createdTimestamp,
    ]);
  });

  download('history.csv', rows.map((r) => r.join(',')).join('\n'));
};

export const downloadVesting = (data: IVesting[]) => {
  const rows = [
    [
      'Vesting Contract',
      'Token Contract',
      'Token Name',
      'Admin',
      'Recipient',
      'Total Vesting',
      'Claimed',
      'Unclaimed',
      'Starts',
      'Ends',
      'Disabled At',
    ],
  ];

  data.forEach((d) => {
    const divisor: number = 10 ** d.tokenDecimals;
    rows.push([
      d.contract,
      d.token,
      d.tokenName,
      d.admin,
      d.recipient,
      (Number(d.totalLocked) / divisor).toString(),
      (Number(d.totalClaimed) / divisor).toString(),
      (Number(d.unclaimed) / divisor).toString(),
      d.startTime,
      d.endTime,
      d.disabledAt,
    ]);
  });
  download(`vesting-[${Math.floor(Date.now() / 1e3)}].csv`, rows.map((r) => r.join(',')).join('\n'));
};

export const downloadCustomHistory = (
  data: IHistory[],
  dateRange: { start: string; end: string },
  eventType: string | null,
  assignedNames: { [key: string]: string }
) => {
  const startTimestamp = Number(new Date(dateRange.start)) / 1e3;
  const endTimestamp = Number(new Date(dateRange.end)) / 1e3;
  let rows: [string[]] = [[]];
  if (eventType === 'Gusto') {
    rows = [['First name', 'Last name', 'Streamed']];
    const earnedByEach: { [key: string]: number } = {};
    for (const i in data) {
      const d = data[i];
      if (Number(d.createdTimestamp) > endTimestamp || Number(d.createdTimestamp) < startTimestamp) continue;
      if (d.eventType !== 'Withdraw') continue;
      if (d.addressRelated === null) continue;
      if (earnedByEach[d.addressRelated] === undefined) {
        earnedByEach[d.addressRelated] = Number(d.amount) / 10 ** Number(d.token.decimals);
      } else {
        const newTotal = (earnedByEach[d.addressRelated] += Number(d.amount) / 10 ** Number(d.token.decimals));
        earnedByEach[d.addressRelated] = newTotal;
      }
    }

    Object.keys(earnedByEach).forEach((p) => {
      const splt = assignedNames[p].split(' ');
      rows.push([splt[0], splt[1], earnedByEach[p].toFixed(2)]);
    });
    download('gusto.csv', rows.map((r) => r.join(',')).join('\n'));
    return;
  }
  if (!eventType) {
    rows = [['Name', 'Address Related', 'Transaction Hash', 'Event Type', 'Amount Per Month/Amount', 'Timestamp']];
  } else if (eventType === 'Withdraw' || eventType === 'Deposit') {
    rows = [['Name', 'Address Related', 'Transaction Hash', 'Event Type', 'Amount', 'Timestamp']];
  } else {
    rows = [['Name', 'Address Related', 'Transaction Hash', 'Event Type', 'Amount Per Month', 'Timestamp']];
  }
  for (const i in data) {
    const d = data[i];
    if (Number(d.createdTimestamp) > endTimestamp || Number(d.createdTimestamp) < startTimestamp) continue;
    if (!eventType || eventType === d.eventType) {
      rows.push([
        d.addressRelated ? assignedNames[d.addressRelated] : '',
        d.addressRelated,
        d.txHash,
        d.eventType,
        eventType === 'Withdraw' || 'Deposit'
          ? Number(d.amount) / 10 ** Number(d.token.decimals)
          : (Number(d.amountPerSec) / 1e20) * secondsByDuration['month'],
        d.createdTimestamp,
      ]);
    }
  }
  download('history.csv', rows.map((r) => r.join(',')).join('\n'));
};
