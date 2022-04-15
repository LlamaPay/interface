import { ITokenList } from 'types';

const CHAIN_ID = 43113;

const fuji: ITokenList[] = [
  {
    chainId: CHAIN_ID,
    address: '0x36861654d8E5e0a641085603a8E7cb88E5419d31',
    name: 'Llama DAI',
    symbol: 'DAI',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    chainId: CHAIN_ID,
    address: '0xAF64a37533E76A2Ff19Dda45806c157037A30FAd',
    name: 'Llama WBTC',
    symbol: 'WBTC',
    decimals: 8,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
  },
  {
    chainId: CHAIN_ID,
    address: '0x8Cf18401B5cC31176bE8F9d6f586a64506B583F1',
    name: 'Llama USDT',
    symbol: 'USDT',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/assets/0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9/logo.png',
  },
  {
    chainId: CHAIN_ID,
    address: '0x330f5B4784100d8eD4DeFb8D80C411BDA435205C',
    name: 'Llama WETH',
    symbol: 'WETH',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  {
    chainId: CHAIN_ID,
    address: '0x68b56283f6C6AC75489B63D09288Dfa2bea104A1',
    name: 'Llama USDC',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
];

export default fuji;
