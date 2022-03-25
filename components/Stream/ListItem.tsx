import * as React from 'react';
import type { UserStreamFragment } from 'services/generated/graphql';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import { formatAddress } from 'lib/address';
import { useTokenPrice } from 'queries/useTokenPrice';
import EmptyToken from 'public/empty-token.webp';
import Image from 'next/image';
import Tooltip from 'components/Tooltip';
import { getAddress } from 'ethers/lib/utils';

interface ItemProps {
  data: UserStreamFragment;
}

interface StreamProps {
  amount: number | null;
  address: string;
  ticker?: string;
  tokenLogo: TokenLogo;
}

type TokenLogo = React.MutableRefObject<string | StaticImageData>;

// TODO cleanup all hardcoded values
export const ListItem = ({ data }: ItemProps) => {
  const isIncoming = data.payer?.id !== '0xfe5ee99fdbccfada674a3b85ef653b3ce4656e13';
  const [amount, setAmount] = React.useState<number | null>(null);

  // TODO and handle error and loading states
  // const { data: tokenDetails } = useTokenPrice('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');

  const { createdAt, amountPerSec, isDataValid } = React.useMemo(() => {
    const createdAt = Number(data.createdTimestamp) * 1000;
    const amountPerSec = Number(data.amountPerSec);
    const isDataValid = !Number.isNaN(createdAt) && !Number.isNaN(amountPerSec);
    return { createdAt, amountPerSec, isDataValid };
  }, [data]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isDataValid) {
        setAmount(((Date.now() - createdAt) / 1000) * amountPerSec);
      } else setAmount(null);
    }, 1000);
    return () => clearInterval(interval);
  }, [createdAt, amountPerSec, isDataValid]);

  // const token = tokenDetails?.coins['ethereum:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'];

  // const tokenAddress = React.useMemo(() => getAddress('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'), []);

  const tokenLogo: TokenLogo = React.useRef(
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
  );

  return (
    <li key={data.streamId} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0">
      {isIncoming ? (
        <IncomingStream amount={amount} address={data.payer.id} tokenLogo={tokenLogo} />
      ) : (
        <OutgoingStream amount={amount} address={data.payee.id} tokenLogo={tokenLogo} />
      )}
    </li>
  );
};

const IncomingStream = ({ amount, address, ticker = 'Unknown token', tokenLogo }: StreamProps) => {
  return (
    <>
      <div className="mr-2 flex flex-1 items-center space-x-2">
        <Tooltip content="Incoming stream">
          <div className="rounded bg-green-100 p-1 text-green-600">
            <span className="sr-only">Incoming stream from</span>
            <ArrowDownIcon className="h-4 w-4" />
          </div>
        </Tooltip>
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">{formatAddress(address)}</span>
      </div>

      {amount && (
        <div className="flex items-baseline space-x-1 tabular-nums">
          <Tooltip content={ticker}>
            <div className="relative top-1 flex">
              <Image
                src={tokenLogo.current}
                onError={() => {
                  tokenLogo.current = EmptyToken;
                }}
                alt={ticker}
                width="20px"
                height="20px"
              />
            </div>
          </Tooltip>
          <span>{`+${amount.toFixed(2)}`}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">so far</span>
          <span>
            <svg
              stroke="currentColor"
              fill="rgb(22 163 74)"
              strokeWidth="0"
              viewBox="0 0 12 16"
              height="10px"
              width="10px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" d="M12 11L6 5l-6 6h12z"></path>
            </svg>
          </span>
        </div>
      )}
    </>
  );
};

const OutgoingStream = ({ amount, address, ticker = 'Unknown token', tokenLogo }: StreamProps) => {
  return (
    <>
      <div className="mr-2 flex flex-1 items-center space-x-2">
        <Tooltip content="Outgoing stream">
          <div className="rounded bg-red-100 p-1 text-red-600">
            <span className="sr-only">Outgoing stream to</span>
            <ArrowUpIcon className="h-4 w-4" />
          </div>
        </Tooltip>
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">{formatAddress(address)}</span>
      </div>
      {amount && (
        <div className="flex items-baseline space-x-1 tabular-nums">
          <Tooltip content={ticker}>
            <div className="relative top-1 flex">
              <Image
                src={tokenLogo.current}
                onError={() => {
                  tokenLogo.current = EmptyToken;
                }}
                alt={ticker}
                width="20px"
                height="20px"
              />
            </div>
          </Tooltip>
          <span>{`-${amount.toFixed(2)}`}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">so far</span>
          <span>
            <svg
              stroke="currentColor"
              fill="rgb(220 38 38)"
              strokeWidth="0"
              viewBox="0 0 12 16"
              height="10px"
              width="10px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" d="M0 5l6 6 6-6H0z"></path>
            </svg>
          </span>
        </div>
      )}
    </>
  );
};
