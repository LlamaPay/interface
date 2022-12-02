import { IPayments } from 'types';

export default function PaymentStatus({ data }: { data: IPayments }) {
  return (
    <span className="font-exo float-left text-center slashed-zero tabular-nums dark:text-white">{getStatus(data)}</span>
  );
}

function getStatus(data: IPayments) {
  if (data.revoked) {
    return `Revoked`;
  } else if (!data.active) {
    return `Redeemed`;
  } else {
    return `Executes in: ${((data.release - Date.now() / 1e3) / 86400).toFixed(2)} days`;
  }
}

export function paymentStatusAccessorFn(data: IPayments) {
  return getStatus(data);
}
