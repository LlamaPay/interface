import Tooltip from 'components/Tooltip';
import { useTokenPrice } from 'queries/useTokenPrice';
import { IBalance } from 'types';

interface MonthlyCostProps {
  data: IBalance;
}

export const MonthlyCost = ({ data }: MonthlyCostProps) => {
  const monthlyCost = (Number(data.totalPaidPerSec) * 2592000) / 1e20;
  const price = useTokenPrice(data.address);
  return (
    <td className="whitespace-nowrap border px-4 py-[6px] text-right text-sm dark:border-stone-700">
      <Tooltip content={`${price && monthlyCost && (Number(price.data) * monthlyCost).toFixed(2)} USD`}>
        <span className="slashed-zero tabular-nums">
          {`${monthlyCost.toLocaleString('en-US', {
            maximumFractionDigits: 5,
          })} ${data.symbol}`}
        </span>
      </Tooltip>
    </td>
  );
};
