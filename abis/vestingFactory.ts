const vestingFactory: any = [
  {
    name: 'VestingEscrowCreated',
    inputs: [
      { name: 'funder', type: 'address', indexed: true },
      { name: 'token', type: 'address', indexed: true },
      { name: 'recipient', type: 'address', indexed: true },
      { name: 'escrow', type: 'address', indexed: false },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'vesting_start', type: 'uint256', indexed: false },
      { name: 'vesting_duration', type: 'uint256', indexed: false },
      { name: 'cliff_length', type: 'uint256', indexed: false },
    ],
    anonymous: false,
    type: 'event',
  },
  { stateMutability: 'nonpayable', type: 'constructor', inputs: [{ name: 'target', type: 'address' }], outputs: [] },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'deploy_vesting_contract',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'vesting_duration', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'deploy_vesting_contract',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'vesting_duration', type: 'uint256' },
      { name: 'vesting_start', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    name: 'deploy_vesting_contract',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'vesting_duration', type: 'uint256' },
      { name: 'vesting_start', type: 'uint256' },
      { name: 'cliff_length', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'contract_by_address',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'address[]' }],
  },
  { stateMutability: 'view', type: 'function', name: 'target', inputs: [], outputs: [{ name: '', type: 'address' }] },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'contract_count',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    name: 'contracts',
    inputs: [
      { name: 'arg0', type: 'address' },
      { name: 'arg1', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'address' }],
  },
];

export default vestingFactory;
