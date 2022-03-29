import * as React from 'react';
import Select from 'react-select/creatable';
import { useTheme } from 'next-themes';
import { useGetContracts } from 'queries/useGetContracts';
import { useGetAllTokensQuery } from "services/generated/graphql";
import { getAddress } from 'ethers/lib/utils';

export const Create = () => {
  // TODO handle error state
  // const { data, isLoading: contractsLoading } = useGetContracts();
  const { data, error, isLoading } = useGetAllTokensQuery();
  const [selectedToken, setSelectedToken] = React.useState<any>();

  const contracts = React.useMemo(() => {
    return data?.llamaPayFactories[0].contracts.map((c) => ({ value: getAddress(c.address), label: getAddress(c.token) })) ?? [];
  }, [data]);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <section className="z-2 flex w-full max-w-lg flex-col">
      <h1 className="mb-2 text-center text-xl">Create a new stream</h1>
      <form className="flex flex-col space-y-4">
        <label className="flex flex-col space-y-1">
          <span>Select a Token</span>
          <Select
            options={contracts}
            classNamePrefix="react-select"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: isDark ? '#52525b' : 'rgb(244 244 245)',
                primary: '#3f3f46',
              },
            })}
            isLoading={isLoading}
            onChange={setSelectedToken}
            name="tokenAddress"
          />
        </label>
        <button className="nav-button mx-auto mt-2">Create Stream</button>
      </form>
    </section>
  );
};
