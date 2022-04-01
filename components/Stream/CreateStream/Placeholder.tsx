import { useTheme } from 'next-themes';
import Select from 'react-select';

const Placeholder = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <form className="flex flex-col space-y-4">
      <label>
        <p>Select a Token to stream</p>
        <Select
          options={[]}
          classNamePrefix="react-select"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: isDark ? '#52525b' : 'rgb(244 244 245)',
              primary: '#3f3f46',
            },
          })}
          isLoading={true}
        />
      </label>
      <label>
        <p>Address to stream</p>
        <input type="text" className="w-full rounded border px-3 py-[6px]" />
      </label>
      <label>
        <p>Amount per sec</p>
        <input type="text" className="w-full rounded border px-3 py-[6px]" />
      </label>
      <button className="nav-button mx-auto mt-2 w-full disabled:cursor-not-allowed" type="button" disabled={true}>
        Create Stream
      </button>
    </form>
  );
};

export default Placeholder;
