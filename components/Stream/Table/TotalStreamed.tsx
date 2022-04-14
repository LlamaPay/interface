import { useTokenPrice } from 'queries/useTokenPrice';
import * as React from 'react';
import { IStream } from 'types';

const TotalStreamed = ({ data }: { data: IStream }) => {
  const [amount, setAmount] = React.useState<string | null>(null);
  const { data: price } = useTokenPrice(data.token.address.toLowerCase());

  React.useEffect(() => {
    const id = setInterval(() => {
      const totalAmount =
        (((Date.now() - Number(data.createdTimestamp) * 1000) / 1000) * Number(data.amountPerSec)) / 1e20;
      setAmount(totalAmount.toFixed(5));
    }, 1);

    // clear interval when component unmounts
    return () => clearInterval(id);
  }, [data]);

  return (
    <div className="flex items-baseline space-x-1">
      <span className="slashed-zero tabular-nums">{amount}</span>
      <span className="text-[10px] tabular-nums">
        {amount && price && `${(Number(amount) * Number(price)).toFixed(2)} USD`}
      </span>
    </div>
  );
  // return ;
};

export default TotalStreamed;
