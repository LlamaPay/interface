import * as React from 'react';
import { useGetAllTokensQuery } from 'services/generated/graphql';
import Select from 'react-select/creatable';
import { useTheme } from 'next-themes';

export const Create = () => {
  // TODO handle error and loading states
  const { data } = useGetAllTokensQuery();
  const [selectedToken, setSelectedToken] = React.useState<string | null>(null);

  const contracts = React.useMemo(() => {
    return data?.llamaPayFactories[0]?.contracts?.map((c) => ({ value: c.address, label: c.token })) ?? [];
  }, [data]);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <form className="z-2 w-full max-w-lg">
      <h1 className="mb-3 text-center text-xl">Create a new stream</h1>
      <label className="flex flex-col space-y-2">
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
          name="tokenAddress"
          onChange={(c) => setSelectedToken(c?.value)}
        />
      </label>
      <button className="nav-button mx-auto mt-2">Create Stream</button>
    </form>
  );
};
