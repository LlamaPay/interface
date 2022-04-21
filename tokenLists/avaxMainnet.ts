import { ITokenList } from 'types';

const CHAIN_ID = 43114;

const avaxMainnet: ITokenList[] = [
  {
    chainId: CHAIN_ID,
    address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    chainId: CHAIN_ID,
    address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  {
    chainId: CHAIN_ID,
    address: '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9/logo.png',
  },
  {
    chainId: CHAIN_ID,
    address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    chainId: CHAIN_ID,
    address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    name: 'USD Coin',
    symbol: 'USDC.e',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    chainId: CHAIN_ID,
    address: '0xD24C2Ad096400B6FBcd2ad8B24E7acBc21A1da64',
    name: 'Frax',
    symbol: 'FRAX',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png',
  },
  {
    chainId: CHAIN_ID,
    address: '0x50b7545627a5162F82A992c33b87aDc75187B218',
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    decimals: 8,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  },
];

export default avaxMainnet;
