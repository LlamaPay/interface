export const subscriptionsFactoryABI = [
  {
    inputs: [
      { internalType: 'contract LlamaSubsFlatRateERC20NonRefundable', name: '_nonrefundableImpl', type: 'address' },
      { internalType: 'contract LlamaSubsFlatRateERC20', name: '_refundableImpl', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'deployedContract', type: 'address' },
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint128', name: 'currentPeriod', type: 'uint128' },
      { indexed: false, internalType: 'uint128', name: 'periodDuration', type: 'uint128' },
      {
        components: [
          { internalType: 'uint216', name: 'costPerPeriod', type: 'uint216' },
          { internalType: 'address', name: 'token', type: 'address' },
        ],
        indexed: false,
        internalType: 'struct LlamaSubsFlatRateERC20.TierInfo[]',
        name: 'tiers',
        type: 'tuple[]',
      },
    ],
    name: 'DeployFlatRateERC20',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'deployedContract', type: 'address' },
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      {
        components: [
          { internalType: 'uint208', name: 'costOfSub', type: 'uint208' },
          { internalType: 'uint40', name: 'duration', type: 'uint40' },
          { internalType: 'address', name: 'token', type: 'address' },
        ],
        indexed: false,
        internalType: 'struct LlamaSubsFlatRateERC20NonRefundable.SubInfo[]',
        name: 'subs',
        type: 'tuple[]',
      },
    ],
    name: 'DeployFlatRateERC20NonRefundable',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'uint128', name: '_currentPeriod', type: 'uint128' },
      { internalType: 'uint128', name: '_periodDuration', type: 'uint128' },
      {
        components: [
          { internalType: 'uint216', name: 'costPerPeriod', type: 'uint216' },
          { internalType: 'address', name: 'token', type: 'address' },
        ],
        internalType: 'struct LlamaSubsFlatRateERC20.TierInfo[]',
        name: 'tiers',
        type: 'tuple[]',
      },
    ],
    name: 'deployFlatRateERC20',
    outputs: [{ internalType: 'contract LlamaSubsFlatRateERC20', name: 'deployedContract', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'uint208', name: 'costOfSub', type: 'uint208' },
          { internalType: 'uint40', name: 'duration', type: 'uint40' },
          { internalType: 'address', name: 'token', type: 'address' },
        ],
        internalType: 'struct LlamaSubsFlatRateERC20NonRefundable.SubInfo[]',
        name: 'subs',
        type: 'tuple[]',
      },
    ],
    name: 'deployFlatRateERC20NonRefundable',
    outputs: [
      { internalType: 'contract LlamaSubsFlatRateERC20NonRefundable', name: 'deployedContract', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nonrefundableImpl',
    outputs: [{ internalType: 'contract LlamaSubsFlatRateERC20NonRefundable', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'refundableImpl',
    outputs: [{ internalType: 'contract LlamaSubsFlatRateERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
