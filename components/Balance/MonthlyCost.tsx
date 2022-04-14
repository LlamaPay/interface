import { useTokenPrice } from 'queries/useTokenPrice';
import { IBalance } from 'types';

interface MonthlyCostProps {
  data: IBalance;
}

export const MonthlyCost = ({ data }: MonthlyCostProps) => {
  const monthlyCost = (Number(data.totalPaidPerSec) * 2592000) / 1e20;
  const price = useTokenPrice(data.address);
  return (
    <td className="whitespace-nowrap border p-1 text-right slashed-zero tabular-nums dark:border-stone-700">
      <div className="flex, space-x-1">
        <span>
          {monthlyCost.toLocaleString('en-US', {
            maximumFractionDigits: 5,
          })}{' '}
          {data.symbol}
        </span>
        <span className="text-[12px]">{(Number(price.data) * monthlyCost).toFixed(2)} USD</span>
      </div>
    </td>
  );
};
