import { useAccount, useEnsName } from 'wagmi';
import useGetRaveName from '~/queries/useGetRaveName';
import { formatAddress } from '~/utils/address';

interface Props {
  showAccountInfo: () => void;
}

export const Account = ({ showAccountInfo }: Props) => {
  const { address } = useAccount();
  const { data: ensName } = useEnsName();
  const { data: raveName } = useGetRaveName();

  if (!address) return null;

  return (
    <button className="nav-button-v2 hidden md:block" onClick={showAccountInfo}>
      {ensName ?? raveName ?? formatAddress(address)}
    </button>
  );
};
