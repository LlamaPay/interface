import { useAccount } from 'wagmi';
import useGetRaveName from '~/queries/useGetRaveName';
import { formatAddress } from '~/utils/address';

interface Props {
  showAccountInfo: () => void;
}

export const Account = ({ showAccountInfo }: Props) => {
  const [{ data }] = useAccount({ fetchEns: true });
  const { data: raveName } = useGetRaveName();

  if (!data) return null;

  const formattedAddress = formatAddress(data.address);

  return (
    <button className="nav-button-v2 hidden md:block" onClick={showAccountInfo}>
      {data.ens?.name ?? raveName ?? formattedAddress}
    </button>
  );
};
