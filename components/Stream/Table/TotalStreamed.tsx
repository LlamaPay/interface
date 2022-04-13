import * as React from 'react';

const TotalStreamed = ({ createdAt, amountPerSec }: { createdAt: string; amountPerSec: number }) => {
  const [amount, setAmount] = React.useState<string | null>(null);

  React.useEffect(() => {
    const id = setInterval(() => {
      const totalAmount = (((Date.now() - Number(createdAt) * 1000) / 1000) * amountPerSec) / 1e20;
      setAmount(totalAmount.toFixed(5));
    }, 1);

    // clear interval when component unmounts
    return () => clearInterval(id);
  }, [amountPerSec, createdAt]);

  return <span className="slashed-zero tabular-nums">{amount}</span>;
};

export default TotalStreamed;
