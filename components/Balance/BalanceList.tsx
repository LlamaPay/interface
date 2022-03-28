import { ethers } from 'ethers';
import { useGetPayerBalance } from 'queries/useGetPayerBalance';
import { formatAddress } from 'utils/address';
import PlaceholderList from './PlaceholderList';

interface BalanceListProps {
  contracts: {
    token: string;
    address: string;
    contract: ethers.Contract;
  }[];
}

// TODO update styles when the list huge
const BalanceList = ({ contracts }: BalanceListProps) => {
  const { data = [], isLoading } = useGetPayerBalance('0xFE5eE99FDbcCFAda674A3b85EF653b3CE4656e13', contracts);

  return (
    <>
      {isLoading ? (
        <PlaceholderList />
      ) : (
        data?.map((d) => (
          <li key={d.token} className="flex justify-between space-x-2">
            {/* TODO handle decimals and display token name and image when not on testnet */}
            <p className="truncate">{formatAddress(d.token)}</p>
            <p>{d.amount}</p>
          </li>
        ))
      )}
    </>
  );
};

export default BalanceList;
