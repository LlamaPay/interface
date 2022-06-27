/* eslint-disable react-hooks/rules-of-hooks */
import { useNetworkProvider } from 'hooks';
import { IVesting } from 'types';
import { formatAddress } from 'utils/address';
import { networkDetails } from 'utils/constants';
import { useAccount } from 'wagmi';

export default function funderOrRecipient({ data }: { data: IVesting }) {
  const { chainId } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();

  const explorerUrl = chainId ? networkDetails[chainId].blockExplorerURL : '';

  return (
    <>
      {accountData?.address.toLowerCase() === data.recipient.toLowerCase() ? (
        <a
          href={
            chainId === 82 || chainId === 1088
              ? `${explorerUrl}address/${data.admin}`
              : `${explorerUrl}/address/${data.admin}`
          }
          target="_blank"
          rel="noreferrer noopener"
          className="font-exo text-center dark:text-white"
        >
          {formatAddress(data.admin)}
        </a>
      ) : (
        <a
          href={
            chainId === 82 || chainId === 1088
              ? `${explorerUrl}address/${data.recipient}`
              : `${explorerUrl}/address/${data.recipient}`
          }
          target="_blank"
          rel="noreferrer noopener"
          className="font-exo text-center dark:text-white"
        >
          {formatAddress(data.recipient)}
        </a>
      )}
    </>
  );
}
