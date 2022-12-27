export const scheduledTransfers = [
  {
    inputs: [{ internalType: 'address', name: '_factory', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'LLAMAPAY_DOESNT_EXIST', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: '_oracle', type: 'address' }],
    name: 'createContract',
    outputs: [{ internalType: 'address', name: 'createdContract', type: 'address' }],
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
    inputs: [],
    name: 'oracle',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
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
    inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
    name: 'predictContract',
    outputs: [
      { internalType: 'address', name: 'predicted', type: 'address' },
      { internalType: 'bool', name: 'deployed', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
