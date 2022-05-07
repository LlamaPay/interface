import { useIntl } from 'next-intl';
import { IBalance } from 'types';

interface MonthlyCostProps {
  data: IBalance;
}

export const MonthlyCost = ({ data }: MonthlyCostProps) => {
  const monthlyCost = (Number(data.totalPaidPerSec) * 2592000) / 1e20;

  const intl = useIntl();

  return (
    <span className="slashed-zero tabular-nums">
      {`${intl.formatNumber(monthlyCost, {
        maximumFractionDigits: 5,
      })} ${data.symbol}`}
    </span>
  );
};
