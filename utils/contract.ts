import { ethers, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';

export type Provider = ethers.providers.BaseProvider;

export const provider = new ethers.providers.JsonRpcProvider(
  `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
);

export const llamapayABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint216', name: 'amountPerSec', type: 'uint216' },
      { indexed: false, internalType: 'bytes32', name: 'streamId', type: 'bytes32' },
    ],
    name: 'StreamCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint216', name: 'amountPerSec', type: 'uint216' },
      { indexed: false, internalType: 'bytes32', name: 'streamId', type: 'bytes32' },
    ],
    name: 'StreamCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'oldTo', type: 'address' },
      { indexed: false, internalType: 'uint216', name: 'oldAmountPerSec', type: 'uint216' },
      { indexed: false, internalType: 'bytes32', name: 'oldStreamId', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint216', name: 'amountPerSec', type: 'uint216' },
      { indexed: false, internalType: 'bytes32', name: 'newStreamId', type: 'bytes32' },
    ],
    name: 'StreamModified',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DECIMALS_DIVISOR',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balances',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes[]', name: 'calls', type: 'bytes[]' },
      { internalType: 'bool', name: 'revertOnFail', type: 'bool' },
    ],
    name: 'batch',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint216', name: 'amountPerSec', type: 'uint216' },
    ],
    name: 'cancelStream',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint216', name: 'amountPerSec', type: 'uint216' },
    ],
    name: 'createStream',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amountToDeposit', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint216', name: 'amountPerSec', type: 'uint216' },
    ],
    name: 'depositAndCreate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'emergencyRug',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'payerAddress', type: 'address' }],
    name: 'getPayerBalance',
    outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint216', name: 'amountPerSec', type: 'uint216' },
    ],
    name: 'getStreamId',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'oldTo', type: 'address' },
      { internalType: 'uint216', name: 'oldAmountPerSec', type: 'uint216' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint216', name: 'amountPerSec', type: 'uint216' },
    ],
    name: 'modifyStream',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'payers',
    outputs: [
      { internalType: 'uint40', name: 'lastPayerUpdate', type: 'uint40' },
      { internalType: 'uint216', name: 'totalPaidPerSec', type: 'uint216' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'contract IERC20Permit', name: 'token', type: 'address' },
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'permitToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'streamToStart',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint216', name: 'amountPerSec', type: 'uint216' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'withdrawPayer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'withdrawPayerAll', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint216', name: 'amountPerSec', type: 'uint216' },
    ],
    name: 'withdrawable',
    outputs: [
      { internalType: 'uint256', name: 'withdrawableAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'lastUpdate', type: 'uint256' },
      { internalType: 'uint256', name: 'owed', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const factoryABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'oldOwner', type: 'address' },
      { indexed: false, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'ApplyTransferOwnership',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'futureOwner', type: 'address' }],
    name: 'CommitTransferOwnership',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'token', type: 'address' },
      { indexed: false, internalType: 'address', name: 'llamaPay', type: 'address' },
    ],
    name: 'LlamaPayCreated',
    type: 'event',
  },
  { inputs: [], name: 'applyTransferOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: '_futureOwner', type: 'address' }],
    name: 'commitTransferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_token', type: 'address' }],
    name: 'createLlamaPayContract',
    outputs: [{ internalType: 'address', name: 'llamaPayContract', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'futureOwner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'getLlamaPayContractByIndex',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_token', type: 'address' }],
    name: 'getLlamaPayContractByToken',
    outputs: [
      { internalType: 'address', name: 'predictedAddress', type: 'address' },
      { internalType: 'bool', name: 'isDeployed', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLlamaPayContractCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'parameter',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export const createContract = (cId: string) => new ethers.Contract(getAddress(cId), llamapayABI, provider);
export const createWriteContract = (id: string, signer: Signer) =>
  new ethers.Contract(getAddress(id), llamapayABI, signer);

export const llamapayFactory = new ethers.Contract(
  getAddress('0x068d6b8ad65679a741d7086c0cb96f8530b38494'),
  factoryABI,
  provider
);
