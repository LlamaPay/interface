import { useAccount } from 'wagmi';
import { formatAddress } from 'lib/address';

interface Props {
  showAccountInfo: () => void;
}

export const Account = ({ showAccountInfo }: Props) => {
  const [{ data }] = useAccount({
    fetchEns: true,
  });

  if (!data) return null;

  const formattedAddress = formatAddress(data.address);

  return (
    <button className="nav-button" onClick={showAccountInfo}>
      {data.ens?.name ? `${data.ens?.name} (${formattedAddress})` : formattedAddress}
    </button>
  );
};
