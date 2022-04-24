import Tooltip from 'components/Tooltip';
import { useLocale } from 'hooks';
import { useTokenPrice } from 'queries/useTokenPrice';
import { IBalance } from 'types';

interface MonthlyCostProps {
  data: IBalance;
}

export const MonthlyCost = ({ data }: MonthlyCostProps) => {
  const monthlyCost = (Number(data.totalPaidPerSec) * 2592000) / 1e20;
  const { data: price } = useTokenPrice(data.address);
  const { locale } = useLocale();

  return (
    <>
      <Tooltip content={price && monthlyCost && `${(Number(price) * monthlyCost).toFixed(2)} USD`}>
        <span className="slashed-zero tabular-nums">
          {`${monthlyCost.toLocaleString(locale, {
            maximumFractionDigits: 5,
          })} ${data.symbol}`}
        </span>
      </Tooltip>
    </>
  );
};
