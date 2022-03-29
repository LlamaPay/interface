import * as React from 'react';
import type { UserStreamFragment } from 'services/generated/graphql';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import { formatAddress } from 'utils/address';
import { useTokenPrice } from 'queries/useTokenPrice';
import EmptyToken from 'public/empty-token.webp';
import Image from 'next/image';
import Tooltip from 'components/Tooltip';
import { useAccount } from 'wagmi';
import { Modify } from './Modify';

interface ItemProps {
  data: UserStreamFragment;
}

interface StreamProps {
  totalStreamed: number | null;
  address: string;
  ticker?: string;
  tokenLogo: TokenLogo;
}

type TokenLogo = React.MutableRefObject<string | StaticImageData>;

// TODO cleanup all hardcoded values
export const ListItem = ({ data }: ItemProps) => {

  const [{ data: accountData }] = useAccount();

  const isIncoming = data.payer?.id !== accountData?.address.toLowerCase();

  const [openModify, setOpenModify] = React.useState(false);

  const [totalStreamed, setTotalStreamed] = React.useState<number | null>(null);

  // TODO and handle error and loading states
  // const { data: tokenDetails } = useTokenPrice('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');

  const { createdAt, amountPerSec, isDataValid } = React.useMemo(() => {
    const createdAt = Number(data.createdTimestamp) * 1000;
    const amountPerSec = Number(data.amountPerSec);
    const isDataValid = !Number.isNaN(createdAt) && !Number.isNaN(amountPerSec);
    return { createdAt, amountPerSec, isDataValid };
  }, [data]);

  const updateStreamed = React.useCallback(() => {
    if (isDataValid) {
      const totalAmount = (((Date.now() - createdAt) / 1000) * amountPerSec) / 1e18;
      setTotalStreamed(totalAmount);
    } else setTotalStreamed(null);
  }, [amountPerSec, createdAt, isDataValid]);

  React.useEffect(() => {
    updateStreamed();

    const interval = setInterval(() => {
      updateStreamed();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateStreamed]);

  // const token = tokenDetails?.coins['ethereum:0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'];
  // const tokenAddress = React.useMemo(() => getAddress('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'), []);

  const tokenLogo: TokenLogo = React.useRef(
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
  );

  return (
    <li key={data.streamId} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0">
      {isIncoming ? (
        <IncomingStream totalStreamed={totalStreamed} address={data.payer.id} tokenLogo={tokenLogo} />
      ) : (
        <>
          <OutgoingStream totalStreamed={totalStreamed} address={data.payee.id} tokenLogo={tokenLogo} />
          <button onClick={() => setOpenModify(!openModify)}> Modify </button>
          <Modify isOpen={openModify} setIsOpen={setOpenModify} payer={data.payer.id} payee={data.payee.id} amtPerSec={data.amountPerSec} contractAddress={data?.contract.address.toString()} />
        </>
      )}

    </li>
  );
};

const IncomingStream = ({ totalStreamed, address, ticker = 'Unknown token', tokenLogo }: StreamProps) => {
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

      {totalStreamed && (
        <div className="flex items-baseline space-x-1 slashed-zero tabular-nums">
          <div className="relative top-[2px] h-6 w-6 self-end">
            <Tooltip content={ticker}>
              <Image
                src={tokenLogo.current}
                onError={() => {
                  tokenLogo.current = EmptyToken;
                }}
                alt={ticker}
                width="20px"
                height="20px"
              />
            </Tooltip>
          </div>
          {/* TODO handle internalization and decimals when totalStreamed is not USD */}
          <span>{`+${totalStreamed.toLocaleString('en-US', {
            maximumFractionDigits: 8,
            minimumFractionDigits: 8,
          })}`}</span>
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

const OutgoingStream = ({ totalStreamed, address, ticker = 'Unknown token', tokenLogo }: StreamProps) => {
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
      {totalStreamed && (
        <div className="flex items-baseline space-x-1 slashed-zero tabular-nums">
          <div className="relative top-[2px] h-6 w-6 self-end">
            <Tooltip content={ticker}>
              <Image
                src={tokenLogo.current}
                onError={() => {
                  tokenLogo.current = EmptyToken;
                }}
                alt={ticker}
                width="20px"
                height="20px"
              />
            </Tooltip>
          </div>
          <span>{`-${totalStreamed.toLocaleString('en-US', {
            maximumFractionDigits: 8,
            minimumFractionDigits: 8,
          })}`}</span>
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
