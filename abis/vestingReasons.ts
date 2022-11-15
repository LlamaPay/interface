const vestingReasons: any = [
  { inputs: [], name: 'NOT_ADMIN', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: '_vestingContract', type: 'address' },
      { internalType: 'string', name: '_reason', type: 'string' },
    ],
    name: 'addReason',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'reasons',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export default vestingReasons;
