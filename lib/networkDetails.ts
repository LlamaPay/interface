import { ethers, providers } from 'ethers';

import * as CONTRACTS from './contracts';

interface INetworkDetails {
  [key: number]: {
    rpcUrl: string;
    subgraphEndpoint?: string;
    chainProviders: ethers.providers.BaseProvider;
    llamapayFactoryAddress?: string;
    disperseAddress?: string;
    botAddress?: string;
    blockExplorerURL: string;
    blockExplorerName: string;
    prefix: string;
    logoURI: string;
    tokenListId?: string;
    vestingFactory: string;
    vestingFactory_v2?: string;
    vestingReason?: string;
    paymentsContract?: string;
    paymentsGraphApi?: string;
    botSubgraph?: string;
    scheduledTransferFactory?: string;
    scheduledTransferSubgraph?: string;
  };
}

const infuraId = 'c580a3487b1241a09f9e27b02c004f5b';
const alchemyId = 'PwvZx2hO2XpToWXSw9sgJJt1eBgjkRUr';
const etherscanKey = 'DDH7EVWI1AQHBNPX5PYRSDM5SHCVBKX58Q';

export const networkDetails: INetworkDetails = {
  43113: {
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-fuji',
    chainProviders: new ethers.providers.StaticJsonRpcProvider(`https://api.avax-test.network/ext/bc/C/rpc`),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_FUJI,
    disperseAddress: '0x267F83942214d11fDce5E8AA98351AFF6392946A',
    botAddress: '',
    blockExplorerURL: 'https://testnet.snowtrace.io/',
    blockExplorerName: 'Snowtrace',
    prefix: 'avax',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  43114: {
    rpcUrl: 'https://rpc.ankr.com/avalanche',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-avalanche-mainnet',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/avalanche'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_AVALANCHE,
    disperseAddress: CONTRACTS.DISPERSE_AVALANCHE,
    botAddress: CONTRACTS.BOT_AVALANCHE,
    blockExplorerURL: 'https://snowtrace.io/',
    blockExplorerName: 'Snowtrace',
    prefix: 'avax',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png',
    tokenListId: 'avalanche',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-avax',
    paymentsContract: CONTRACTS.PAYMENTS_AVALANCHE,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-avalanche',
  },
  137: {
    rpcUrl: 'https://polygon-rpc.com/',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-polygon',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://polygon-rpc.com/'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_POLYGON,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_POLYGON,
    blockExplorerURL: 'https://polygonscan.com/',
    blockExplorerName: 'Polygonscan',
    prefix: 'polygon',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    tokenListId: 'polygon-pos',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    paymentsContract: CONTRACTS.PAYMENTS_POLYGON,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-polygon',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-polygon',
  },
  250: {
    rpcUrl: 'https://rpc.ftm.tools/',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-fantom',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ftm.tools/'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_FANTOM,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_FANTOM,
    blockExplorerURL: 'https://ftmscan.com/',
    blockExplorerName: 'FTMScan',
    prefix: 'fantom',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
    tokenListId: 'fantom',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-fantom',
    paymentsContract: CONTRACTS.PAYMENTS_FANTOM,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-fantom',
  },
  1: {
    rpcUrl: 'https://rpc.ankr.com/eth',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-mainnet',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/eth'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_MAINNET,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_MAINNET,
    blockExplorerURL: 'https://etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    tokenListId: 'ethereum',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    vestingFactory_v2: CONTRACTS.VESTING_FACTORY_V2,
    vestingReason: '0xA83965c2EBCD3d809f59030D2f7d3c6C646deD3D',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-mainnet',
    paymentsContract: CONTRACTS.PAYMENTS_MAINNET,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-mainnet',
    scheduledTransferFactory: CONTRACTS.SCHEDULED_TRANSFERS_FACTORY_MAINNET,
    scheduledTransferSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/scheduled-transfers-mainnet',
  },
  10: {
    rpcUrl: 'https://rpc.ankr.com/optimism',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-optimism',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/optimism'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_OPTIMISM,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_OPTIMISM,
    blockExplorerURL: 'https://optimistic.etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'optimism',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
    tokenListId: 'optimistic-ethereum',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-optimism',
    paymentsContract: CONTRACTS.PAYMENTS_OPTIMISM,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-optimism',
    scheduledTransferFactory: CONTRACTS.SCHEDULED_TRANSFERS_FACTORY_OPTIMISM,
    scheduledTransferSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/scheduledtransfers-optimism',
  },
  42161: {
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-arbitrum',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://arb1.arbitrum.io/rpc'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_ARBITRUM,
    disperseAddress: CONTRACTS.DISPERSE_ARBITRUM,
    botAddress: CONTRACTS.BOT_ARBITRUM,
    blockExplorerURL: 'https://arbiscan.io/',
    blockExplorerName: 'Arbiscan',
    prefix: 'arbitrum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
    tokenListId: 'arbitrum-one',
    vestingFactory: CONTRACTS.VESTING_FACTORY,

    paymentsContract: CONTRACTS.PAYMENTS_ARBITRUM,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-arbitrum',
  },
  56: {
    rpcUrl: 'https://rpc.ankr.com/bsc',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bsc',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/bsc'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_BSC,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_BSC,
    blockExplorerURL: 'https://www.bscscan.com/',
    blockExplorerName: 'BscScan',
    prefix: 'bsc',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
    tokenListId: 'binance-smart-chain',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
    paymentsContract: CONTRACTS.PAYMENTS_BSC,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-bsc',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-bsc',
  },
  100: {
    rpcUrl: 'https://rpc.ankr.com/gnosis',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-xdai',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/gnosis'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_XDAI,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: '',
    blockExplorerURL: 'https://blockscout.com/xdai/mainnet/',
    blockExplorerName: 'Blockscout',
    prefix: 'xdai',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png',
    tokenListId: 'xdai',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  82: {
    rpcUrl: 'https://rpc.meter.io',
    subgraphEndpoint: 'https://graph-meter.voltswap.finance/subgraphs/name/nemusonaneko/llamapay-subgraph',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.meter.io'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_METER,
    disperseAddress: CONTRACTS.DISPERSE_METER,
    botAddress: '',
    blockExplorerURL: 'https://scan.meter.io/',
    blockExplorerName: 'Meter Blockchain Explorer',
    prefix: 'meter',
    logoURI: 'https://assets.coingecko.com/coins/images/11848/large/mtrg-logo.png?1595062273',
    tokenListId: 'meter',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  5: {
    rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-goerli',
    chainProviders: providers.getDefaultProvider(5, {
      alchemy: alchemyId,
      etherscan: etherscanKey,
      infura: infuraId,
    }),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_GOERLI,
    disperseAddress: CONTRACTS.DISPERSE_GOERLI,
    botAddress: CONTRACTS.BOT_GOERLI,
    blockExplorerURL: 'https://goerli.etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_GOERLI,
    vestingReason: '0xA83965c2EBCD3d809f59030D2f7d3c6C646deD3D',
    paymentsContract: CONTRACTS.PAYMENTS_GOERLI,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-goerli',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-goerli',
    scheduledTransferFactory: CONTRACTS.SCHEDULED_TRANSFERS_FACTORY_GOERLI,
    scheduledTransferSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/scheduledtransfers-subgraph',
  },
  1088: {
    rpcUrl: 'https://andromeda.metis.io/?owner=1088',
    subgraphEndpoint: 'https://andromeda-graph.metis.io/subgraphs/name/maia-dao/llama-pay',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://andromeda.metis.io/?owner=1088'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_METIS,
    disperseAddress: CONTRACTS.DISPERSE_METIS,
    botAddress: '',
    blockExplorerURL: 'https://andromeda-explorer.metis.io/',
    blockExplorerName: 'Andromeda Metis Explorer',
    prefix: 'metis',
    tokenListId: 'metis-andromeda',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/metis/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  2222: {
    rpcUrl: 'https://evm.kava.io',
    subgraphEndpoint: 'https://the-graph.kava.io/subgraphs/name/nemusonaneko/llamapay-subgraph/',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://evm.kava.io'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_KAVA,
    disperseAddress: CONTRACTS.DISPERSE_KAVA,
    botAddress: '',
    blockExplorerURL: 'https://explorer.kava.io/',
    blockExplorerName: 'Kava Explorer',
    prefix: 'kava',
    tokenListId: 'kava-evm',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/kava/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  42170: {
    rpcUrl: 'https://nova.arbitrum.io/rpc',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://nova.arbitrum.io/rpc'),
    blockExplorerURL: 'https://nova-explorer.arbitrum.io',
    blockExplorerName: 'Arbitrum Nova Chain Explorer',
    prefix: 'arbitrum_nova',
    tokenListId: 'arbitrum_nova',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_arbitrum-nova.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  592: {
    rpcUrl: 'https://evm.astar.network',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://evm.astar.network'),
    blockExplorerURL: 'https://astar.subscan.io',
    blockExplorerName: 'subscan',
    prefix: 'astar',
    tokenListId: 'astar',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_astar.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  3776: {
    rpcUrl: 'https://rpc.startale.com/astar-zkevm',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.startale.com/astar-zkevm'),
    blockExplorerURL: 'https://astar-zkevm.explorer.startale.com',
    blockExplorerName: 'Blockscout Astar zkEVM explorer',
    prefix: 'astar_zkevm',
    tokenListId: 'astar_zkevm',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_astar-zkevm.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  8453: {
    rpcUrl: 'https://mainnet.base.org',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://mainnet.base.org'),
    blockExplorerURL: 'https://basescan.org',
    blockExplorerName: 'basescan',
    prefix: 'base',
    tokenListId: 'base',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  1313161554: {
    rpcUrl: 'https://aurora.drpc.org',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://aurora.drpc.org'),
    blockExplorerURL: 'https://aurorascan.dev',
    blockExplorerName: 'aurorascan.dev',
    prefix: 'aurora',
    tokenListId: 'aurora',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aurora/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  81457: {
    rpcUrl: 'https://rpc.blast.io',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.blast.io'),
    blockExplorerURL: 'https://blastscan.io',
    blockExplorerName: 'Blastscan',
    prefix: 'blast',
    tokenListId: 'blast',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_blast.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  7700: {
    rpcUrl: 'https://canto.slingshot.finance',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://canto.slingshot.finance'),
    blockExplorerURL: 'https://www.oklink.com/canto',
    blockExplorerName: 'Canto Explorer (OKLink)',
    prefix: 'canto',
    tokenListId: 'canto',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/nativecanto/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  42220: {
    rpcUrl: 'https://forno.celo.org',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://forno.celo.org'),
    blockExplorerURL: 'https://celoscan.io',
    blockExplorerName: 'Celoscan',
    prefix: 'celo',
    tokenListId: 'celo',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/celo/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  25: {
    rpcUrl: 'https://evm.cronos.org',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://evm.cronos.org'),
    blockExplorerURL: 'https://explorer.cronos.org',
    blockExplorerName: 'Cronos Explorer',
    prefix: 'cronos',
    tokenListId: 'cronos',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cronos/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  2000: {
    rpcUrl: 'https://rpc.dogechain.dog',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.dogechain.dog'),
    blockExplorerURL: 'https://explorer.dogechain.dog',
    blockExplorerName: 'dogechain explorer',
    prefix: 'dogechain',
    tokenListId: 'dogechain',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_dogechain.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  9001: {
    rpcUrl: 'https://evmos.lava.build',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://evmos.lava.build'),
    blockExplorerURL: 'https://escan.live',
    blockExplorerName: 'Evmos Explorer (Escan)',
    prefix: 'evmos',
    tokenListId: 'evmos',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/evmos/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  252: {
    rpcUrl: 'https://rpc.frax.com',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.frax.com'),
    blockExplorerURL: 'https://fraxscan.com',
    blockExplorerName: 'fraxscan',
    prefix: 'fraxtal',
    tokenListId: 'fraxtal',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_fraxtal.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  1666600000: {
    rpcUrl: 'https://rpc.ankr.com/harmony',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/harmony'),
    blockExplorerURL: 'https://explorer.harmony.one',
    blockExplorerName: 'Harmony Block Explorer',
    prefix: 'harmony',
    tokenListId: 'harmony',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/harmony/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  321: {
    rpcUrl: 'https://rpc-mainnet.kcc.network',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc-mainnet.kcc.network'),
    blockExplorerURL: 'https://explorer.kcc.io/en',
    blockExplorerName: 'KCC Explorer',
    prefix: 'kcc',
    tokenListId: 'kcc',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/kcc/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  59144: {
    rpcUrl: 'https://rpc.linea.build',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.linea.build'),
    blockExplorerURL: 'https://lineascan.build',
    blockExplorerName: 'Etherscan',
    prefix: 'linea',
    tokenListId: 'linea',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/linea/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  169: {
    rpcUrl: 'https://pacific-rpc.manta.network/http',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://pacific-rpc.manta.network/http'),
    blockExplorerURL: 'https://pacific-explorer.manta.network',
    blockExplorerName: 'manta-pacific Explorer',
    prefix: 'manta',
    tokenListId: 'manta',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/manta/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  5000: {
    rpcUrl: 'https://rpc.mantle.xyz',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.mantle.xyz'),
    blockExplorerURL: 'https://explorer.mantle.xyz',
    blockExplorerName: 'Mantle Explorer',
    prefix: 'mantle',
    tokenListId: 'mantle',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/mantle/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  1284: {
    rpcUrl: 'https://rpc.api.moonbeam.network',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.api.moonbeam.network'),
    blockExplorerURL: 'https://moonbeam.moonscan.io',
    blockExplorerName: 'moonscan',
    prefix: 'moonbeam',
    tokenListId: 'moonbeam',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/moonbeam/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  1285: {
    rpcUrl: 'https://rpc.api.moonriver.moonbeam.network',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.api.moonriver.moonbeam.network'),
    blockExplorerURL: 'https://moonriver.moonscan.io',
    blockExplorerName: 'moonscan',
    prefix: 'moonriver',
    tokenListId: 'moonriver',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/moonriver/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  4200: {
    rpcUrl: 'https://rpc.merlinchain.io',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.merlinchain.io'),
    blockExplorerURL: 'https://scan.merlinchain.io',
    blockExplorerName: 'blockscout',
    prefix: 'merlin',
    tokenListId: 'merlin',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_merlin.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  204: {
    rpcUrl: 'https://opbnb-mainnet-rpc.bnbchain.org',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://opbnb-mainnet-rpc.bnbchain.org'),
    blockExplorerURL: 'https://mainnet.opbnbscan.com',
    blockExplorerName: 'opbnbscan',
    prefix: 'opbnb',
    tokenListId: 'opbnb',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/opbnb/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  369: {
    rpcUrl: 'https://rpc.pulsechain.com',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.pulsechain.com'),
    blockExplorerURL: 'https://scan.pulsechain.com',
    blockExplorerName: 'blockscout',
    prefix: 'pulsechain',
    tokenListId: 'pulsechain',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_pulsechain.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  534352: {
    rpcUrl: 'https://rpc.scroll.io',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.scroll.io'),
    blockExplorerURL: 'https://scrollscan.com',
    blockExplorerName: 'Scrollscan',
    prefix: 'scroll',
    tokenListId: 'scroll',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/scroll/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  7777777: {
    rpcUrl: 'https://rpc.zora.energy',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.zora.energy'),
    blockExplorerURL: 'https://explorer.zora.energy',
    blockExplorerName: 'Zora Network Explorer',
    prefix: 'zora',
    tokenListId: 'zora',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_zora.webp',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  61: {
    rpcUrl: 'https://etc.etcdesktop.com',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://etc.etcdesktop.com'),
    blockExplorerURL: 'https://etc.blockscout.com',
    blockExplorerName: 'blockscout-ethereum-classic',
    prefix: 'ethclassic',
    tokenListId: 'ethclassic',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/classic/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  122: {
    rpcUrl: 'https://rpc.fuse.io',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.fuse.io'),
    blockExplorerURL: 'https://explorer.fuse.io',
    blockExplorerName: 'blockscout',
    prefix: 'fuse',
    tokenListId: 'fuse',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_fuse.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  32659: {
    rpcUrl: 'https://mainnet.fusionnetwork.io',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://mainnet.fusionnetwork.io'),
    blockExplorerURL: 'https://fsnscan.com',
    blockExplorerName: 'fsnscan',
    prefix: 'fusion',
    tokenListId: 'fusion',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fusion/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  8217: {
    rpcUrl: 'https://public-en-cypress.klaytn.net',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://public-en-cypress.klaytn.net'),
    blockExplorerURL: 'https://scope.klaytn.com',
    blockExplorerName: 'Klaytnscope',
    prefix: 'klaytn',
    tokenListId: 'klaytn',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/klaytn/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  34443: {
    rpcUrl: 'https://mainnet.mode.network',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://mainnet.mode.network'),
    blockExplorerURL: 'https://explorer.mode.network',
    blockExplorerName: 'modescout',
    prefix: 'mode',
    tokenListId: 'mode',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_mode.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  3109: {
    rpcUrl: 'https://alpha-rpc-node-http.svmscan.io',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://alpha-rpc-node-http.svmscan.io'),
    blockExplorerURL: 'https://svmscan.io/',
    blockExplorerName: 'Explorer',
    prefix: 'satoshivm',
    tokenListId: 'satoshivm',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_satoshivm.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  40: {
    rpcUrl: 'https://mainnet.telos.net/evm',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://mainnet.telos.net/evm'),
    blockExplorerURL: 'https://teloscan.io',
    blockExplorerName: 'teloscan',
    prefix: 'telos',
    tokenListId: 'telos',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_telos.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
  1101: {
    rpcUrl: 'https://rpc.ankr.com/polygon_zkevm',
    chainProviders: new ethers.providers.StaticJsonRpcProvider('https://rpc.ankr.com/polygon_zkevm'),
    blockExplorerURL: 'https://zkevm.polygonscan.com/',
    blockExplorerName: 'polygonscan',
    prefix: 'polygon_zkevm',
    tokenListId: 'polygon_zkevm',
    logoURI: 'https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/rsz_polygon zkevm.jpg',
    vestingFactory: CONTRACTS.VESTING_FACTORY,
  },
};
