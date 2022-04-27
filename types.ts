import { Contract } from 'ethers';
import { UserHistoryFragment } from 'services/generated/graphql';

export interface IToken {
  tokenAddress: string;
  llamaContractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  tokenContract: Contract;
  llamaTokenContract: Contract;
}

export interface IBalance {
  name: string;
  address: string;
  symbol: string;
  amount: string;
  logoURI: string;
  contractAddress: string;
  tokenDecimals: number;
  tokenContract: Contract;
  totalPaidPerSec: string | null;
  lastPayerUpdate: string | null;
}

export interface IPayer {
  name: string;
  address: string;
  symbol: string;
  contractAddress: string;
  tokenDecimals: number;
  tokenContract: Contract;
  totalPaidPerSec: string | null;
  lastPayerUpdate: string | null;
}

export interface IStream {
  llamaContractAddress: string;
  amountPerSec: string;
  createdTimestamp: string;
  payerAddress: string;
  payeeAddress: string;
  streamId: string;
  streamType: 'outgoingStream' | 'incomingStream';
  token: { address: string; name: string; decimals: number; symbol: string };
  tokenName: string;
  tokenSymbol: string;
  tokenContract: Contract;
  llamaTokenContract: Contract;
  historicalEvents: { eventType: string; txHash: string; createdTimestamp: string }[];
  paused: boolean;
  pausedAmount: string;
  lastPaused: string;
  reason: string | null | undefined;
}

export interface IHistory extends UserHistoryFragment {
  addressRelated: string | null;
  addressType: 'payer' | 'payee';
  amountPerSec: string;
}

export interface IStreamAndHistory {
  streams: IStream[] | null;
  history: IHistory[] | null;
  hasBothStreamTypes: boolean;
}

export interface ITokenList {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export interface ITokenLists extends IToken {
  logoURI: string;
  isVerified: boolean;
}
