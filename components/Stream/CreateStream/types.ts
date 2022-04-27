import { DisclosureState } from 'ariakit';
import { ITokenBalance } from 'queries/useTokenBalances';
import { IToken } from 'types';

export interface TokenOption {
  label: string;
  value: string;
}

export interface IStreamFormProps {
  tokens: ITokenBalance[];
  userAddress: string;
  dialog: DisclosureState;
}

export interface ICreateProps {
  tokens: IToken[] | null;
  noBalances: boolean;
  isLoading: boolean;
  isError: boolean;
}

export interface ICheckApproval {
  tokenAddress: string;
  userAddress?: string;
  approvedForAmount: string;
}

export interface IFormElements {
  amountToDeposit: { value: string };
  amountToStream: { value: string };
  streamDuration: { value: 'year' | 'month' };
  addressToStream: { value: string };
  shortName: { value: string };
}

export interface ICreateStreamForm {
  balancesExist: boolean;
  tokens: IToken[];
}
