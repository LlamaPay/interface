export const vestingContractReadableABI = [
  'function claim(address beneficiary, uint256 amount)',
  'function rug_pull()',
  'function renounce_ownership()',
];

export const vestingContractV2ReadableABI = [
  'function claim(address beneficiary, uint256 amount)',
  'function revoke()',
  'function disown()',
];
