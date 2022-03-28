import * as React from 'react';
import { useGetAllTokensQuery } from 'services/generated/graphql';
import { createContract } from 'utils/contract';
import PlaceholderList from './PlaceholderList';
import BalanceList from './BalanceList';

const Balance = () => {
  //TODO handle error and loading states
  const { data: tokens, isLoading, error } = useGetAllTokensQuery();

  const tokenContracts = React.useMemo(() => {
    return (
      tokens?.llamaPayFactories[0]?.contracts?.map((c) => ({
        token: c.token,
        address: c.address,
        contract: createContract(c.address),
      })) ?? []
    );
  }, [tokens]);

  return (
    <section className="w-full max-w-lg">
      <h1 className="mb-3 text-center text-xl">Balances</h1>
      {error ? (
        <div className="mx-auto min-h-[44px] max-w-2xl border p-2">
          <p className="text-center text-sm text-red-500">Something went wrong!</p>
        </div>
      ) : (
        <ul className="mx-auto min-h-[44px] max-w-2xl space-y-3 border p-2">
          {isLoading ? <PlaceholderList /> : <BalanceList contracts={tokenContracts} />}
        </ul>
      )}
    </section>
  );
};

export default Balance;
