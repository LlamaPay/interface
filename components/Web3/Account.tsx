import { useAccount } from 'wagmi';
import { formatAddress } from 'utils/address';

interface Props {
  showAccountInfo: () => void;
}

export const Account = ({ showAccountInfo }: Props) => {
  const [{ data }] = useAccount();

  if (!data) return null;

  const formattedAddress = formatAddress(data.address);

  return (
    <button
      className="nav-button hidden bg-[#23BD8F] text-white dark:border-[#333336] md:block"
      onClick={showAccountInfo}
    >
      {data.ens?.name ? `${data.ens?.name} (${formattedAddress})` : formattedAddress}
    </button>
  );
};
