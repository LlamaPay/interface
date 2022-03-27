import * as React from 'react';
import { useGetPayerBalance } from 'queries/useGetPayerBalance';
import { useGetAllTokensQuery } from 'services/generated/graphql';
import { createContract } from 'utils/contract';
import { formatAddress } from 'utils/address';

const Balance = () => {
  //TODO handle error and loading states
  const { data: tokens } = useGetAllTokensQuery();

  const tokenContracts = React.useMemo(() => {
    return (
      tokens?.llamaPayFactories[0]?.contracts?.map((c) => ({
        token: c.token,
        address: c.address,
        contract: createContract(c.address),
      })) ?? []
    );
  }, [tokens]);

  const { data = [], refetch } = useGetPayerBalance('0xFE5eE99FDbcCFAda674A3b85EF653b3CE4656e13', tokenContracts);

  React.useEffect(() => {
    if (tokenContracts.length > 0) refetch();
  }, [tokenContracts, refetch]);

  return (
    <section>
      <h1 className="text-center text-xl">Balances</h1>
      <ul className="mx-auto max-w-2xl">
        {data?.map((d) => (
          <li key={d.token} className="flex justify-between space-x-2 border p-2">
            <p className="truncate">{formatAddress(d.token)}</p>
            {/* TODO handle decimals */}
            <p>{d.amount}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Balance;
