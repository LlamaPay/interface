import * as wagmiChains from 'wagmi/chains';

const defaultChains: Array<wagmiChains.Chain> = [
  wagmiChains.mainnet,
  wagmiChains.optimism,
  wagmiChains.arbitrum,
  wagmiChains.polygon,
  wagmiChains.avalanche,
  wagmiChains.fantom,
  wagmiChains.bsc,
  wagmiChains.gnosis,
  wagmiChains.goerli,
  wagmiChains.avalancheFuji,
];

export const chains: Array<wagmiChains.Chain> = [
  ...defaultChains,
  {
    id: 8453,
    name: 'Base',
    network: 'base',
    nativeCurrency: { "name": "Ether", "symbol": "ETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://mainnet.base.org'] }, public: { http: ['https://mainnet.base.org'] } },
    blockExplorers: {
      default: {
        name: 'basescan',
        url: 'https://basescan.org',
      },
    },
  },
  {
    id: 81457,
    name: 'Blast',
    network: 'blast',
    nativeCurrency: { "name": "Ether", "symbol": "ETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.blast.io'] }, public: { http: ['https://rpc.blast.io'] } },
    blockExplorers: {
      default: {
        name: 'Blastscan',
        url: 'https://blastscan.io',
      },
    },
  },
  {
    id: 82,
    name: 'Meter',
    network: 'meter',
    nativeCurrency: { name: 'Meter', symbol: 'MTR', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.meter.io'] }, public: { http: ['https://rpc.meter.io'] } },
    blockExplorers: {
      default: {
        name: 'Meter Blockchain Explorer',
        url: 'https://scan.meter.io/',
      },
    },
  },
  {
    id: 2222,
    name: 'Kava',
    network: 'kava',
    nativeCurrency: { name: 'Kava', symbol: 'KAVA', decimals: 18 },
    rpcUrls: { default: { http: ['https://evm.kava.io'] }, public: { http: ['https://evm.kava.io'] } },
    blockExplorers: {
      default: {
        name: 'Kava Explorer',
        url: 'https://explorer.kava.io/',
      },
    },
  },
  {
    id: 1088,
    name: 'Metis',
    network: 'metis',
    nativeCurrency: { name: 'Metis', symbol: 'METIS', decimals: 18 },
    rpcUrls: { default: { http: ['https://andromeda.metis.io/?owner=1088'] }, public: { http: ['https://andromeda.metis.io/?owner=1088'] } },
    blockExplorers: {
      default: {
        name: 'Andromeda Metis Explorer',
        url: 'https://andromeda-explorer.metis.io/',
      },
    }
  },
  {
    id: 42170,
    name: 'Arbitrum Nova',
    network: 'arbitrum_nova',
    nativeCurrency: { "name": "Ether", "symbol": "ETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://nova.arbitrum.io/rpc'] }, public: { http: ['https://nova.arbitrum.io/rpc'] } },
    blockExplorers: {
      default: {
        name: 'Arbitrum Nova Chain Explorer',
        url: 'https://nova-explorer.arbitrum.io',
      },
    },
  },
  {
    id: 592,
    name: 'Astar',
    network: 'astar',
    nativeCurrency: { "name": "Astar", "symbol": "ASTR", "decimals": 18 },
    rpcUrls: { default: { http: ['https://evm.astar.network'] }, public: { http: ['https://evm.astar.network'] } },
    blockExplorers: {
      default: {
        name: 'subscan',
        url: 'https://astar.subscan.io',
      },
    },
  },
  {
    id: 3776,
    name: 'Astar zkEVM',
    network: 'astar_zkevm',
    nativeCurrency: { "name": "Ether", "symbol": "ETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.startale.com/astar-zkevm'] }, public: { http: ['https://rpc.startale.com/astar-zkevm'] } },
    blockExplorers: {
      default: {
        name: 'Blockscout Astar zkEVM explorer',
        url: 'https://astar-zkevm.explorer.startale.com',
      },
    },
  },
  {
    id: 1313161554,
    name: 'Aurora',
    network: 'aurora',
    nativeCurrency: { "name": "Ether", "symbol": "ETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://aurora.drpc.org'] }, public: { http: ['https://aurora.drpc.org'] } },
    blockExplorers: {
      default: {
        name: 'aurorascan.dev',
        url: 'https://aurorascan.dev',
      },
    },
  },
  {
    id: 7700,
    name: 'Canto',
    network: 'canto',
    nativeCurrency: { "name": "Canto", "symbol": "CANTO", "decimals": 18 },
    rpcUrls: { default: { http: ['https://canto.slingshot.finance'] }, public: { http: ['https://canto.slingshot.finance'] } },
    blockExplorers: {
      default: {
        name: 'Canto Explorer (OKLink)',
        url: 'https://www.oklink.com/canto',
      },
    },
  },
  {
    id: 42220,
    name: 'Celo',
    network: 'celo',
    nativeCurrency: { "name": "CELO", "symbol": "CELO", "decimals": 18 },
    rpcUrls: { default: { http: ['https://forno.celo.org'] }, public: { http: ['https://forno.celo.org'] } },
    blockExplorers: {
      default: {
        name: 'Celoscan',
        url: 'https://celoscan.io',
      },
    },
  },
  {
    id: 25,
    name: 'Cronos',
    network: 'cronos',
    nativeCurrency: { "name": "Cronos", "symbol": "CRO", "decimals": 18 },
    rpcUrls: { default: { http: ['https://evm.cronos.org'] }, public: { http: ['https://evm.cronos.org'] } },
    blockExplorers: {
      default: {
        name: 'Cronos Explorer',
        url: 'https://explorer.cronos.org',
      },
    },
  },
  {
    id: 2000,
    name: 'Dogechain',
    network: 'dogechain',
    nativeCurrency: { "name": "Dogecoin", "symbol": "DOGE", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.dogechain.dog'] }, public: { http: ['https://rpc.dogechain.dog'] } },
    blockExplorers: {
      default: {
        name: 'dogechain explorer',
        url: 'https://explorer.dogechain.dog',
      },
    },
  },
  {
    id: 9001,
    name: 'Evmos',
    network: 'evmos',
    nativeCurrency: { "name": "Evmos", "symbol": "EVMOS", "decimals": 18 },
    rpcUrls: { default: { http: ['https://evmos.lava.build'] }, public: { http: ['https://evmos.lava.build'] } },
    blockExplorers: {
      default: {
        name: 'Evmos Explorer (Escan)',
        url: 'https://escan.live',
      },
    },
  },
  {
    id: 252,
    name: 'Fraxtal',
    network: 'fraxtal',
    nativeCurrency: { "name": "Frax Ether", "symbol": "frxETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.frax.com'] }, public: { http: ['https://rpc.frax.com'] } },
    blockExplorers: {
      default: {
        name: 'fraxscan',
        url: 'https://fraxscan.com',
      },
    },
  },
  {
    id: 1666600000,
    name: 'Harmony',
    network: 'harmony',
    nativeCurrency: { "name": "ONE", "symbol": "ONE", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.ankr.com/harmony'] }, public: { http: ['https://rpc.ankr.com/harmony'] } },
    blockExplorers: {
      default: {
        name: 'Harmony Block Explorer',
        url: 'https://explorer.harmony.one',
      },
    },
  },
  {
    id: 2222,
    name: 'Kava',
    network: 'kava',
    nativeCurrency: { "name": "Kava", "symbol": "KAVA", "decimals": 18 },
    rpcUrls: { default: { http: ['https://evm.kava.io'] }, public: { http: ['https://evm.kava.io'] } },
    blockExplorers: {
      default: {
        name: 'Kava EVM Explorer',
        url: 'https://kavascan.com',
      },
    },
  },
  {
    id: 321,
    name: 'KCC',
    network: 'kcc',
    nativeCurrency: { "name": "KuCoin Token", "symbol": "KCS", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc-mainnet.kcc.network'] }, public: { http: ['https://rpc-mainnet.kcc.network'] } },
    blockExplorers: {
      default: {
        name: 'KCC Explorer',
        url: 'https://explorer.kcc.io/en',
      },
    },
  },
  {
    id: 59144,
    name: 'Linea',
    network: 'linea',
    nativeCurrency: { "name": "Linea Ether", "symbol": "ETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.linea.build'] }, public: { http: ['https://rpc.linea.build'] } },
    blockExplorers: {
      default: {
        name: 'Etherscan',
        url: 'https://lineascan.build',
      },
    },
  },
  {
    id: 169,
    name: 'Manta Pacific',
    network: 'manta',
    nativeCurrency: { "name": "Ether", "symbol": "ETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://pacific-rpc.manta.network/http'] }, public: { http: ['https://pacific-rpc.manta.network/http'] } },
    blockExplorers: {
      default: {
        name: 'manta-pacific Explorer',
        url: 'https://pacific-explorer.manta.network',
      },
    },
  },
  {
    id: 5000,
    name: 'Mantle',
    network: 'mantle',
    nativeCurrency: { "name": "Mantle", "symbol": "MNT", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.mantle.xyz'] }, public: { http: ['https://rpc.mantle.xyz'] } },
    blockExplorers: {
      default: {
        name: 'Mantle Explorer',
        url: 'https://explorer.mantle.xyz',
      },
    },
  },
  {
    id: 1284,
    name: 'Moonbeam',
    network: 'moonbeam',
    nativeCurrency: { "name": "Glimmer", "symbol": "GLMR", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.api.moonbeam.network'] }, public: { http: ['https://rpc.api.moonbeam.network'] } },
    blockExplorers: {
      default: {
        name: 'moonscan',
        url: 'https://moonbeam.moonscan.io',
      },
    },
  },
  {
    id: 1285,
    name: 'Moonriver',
    network: 'moonriver',
    nativeCurrency: { "name": "Moonriver", "symbol": "MOVR", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.api.moonriver.moonbeam.network'] }, public: { http: ['https://rpc.api.moonriver.moonbeam.network'] } },
    blockExplorers: {
      default: {
        name: 'moonscan',
        url: 'https://moonriver.moonscan.io',
      },
    },
  },
  {
    id: 4200,
    name: 'Merlin',
    network: 'merlin',
    nativeCurrency: { "name": "BTC", "symbol": "BTC", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.merlinchain.io'] }, public: { http: ['https://rpc.merlinchain.io'] } },
    blockExplorers: {
      default: {
        name: 'blockscout',
        url: 'https://scan.merlinchain.io',
      },
    },
  },
  {
    id: 204,
    name: 'opBNB',
    network: 'opbnb',
    nativeCurrency: { "name": "BNB Chain Native Token", "symbol": "BNB", "decimals": 18 },
    rpcUrls: { default: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'] }, public: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'] } },
    blockExplorers: {
      default: {
        name: 'opbnbscan',
        url: 'https://mainnet.opbnbscan.com',
      },
    },
  },
  {
    id: 369,
    name: 'PulseChain',
    network: 'pulsechain',
    nativeCurrency: { "name": "Pulse", "symbol": "PLS", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.pulsechain.com'] }, public: { http: ['https://rpc.pulsechain.com'] } },
    blockExplorers: {
      default: {
        name: 'blockscout',
        url: 'https://scan.pulsechain.com',
      },
    },
  },
  {
    id: 534352,
    name: 'Scroll',
    network: 'scroll',
    nativeCurrency: { "name": "Ether", "symbol": "ETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.scroll.io'] }, public: { http: ['https://rpc.scroll.io'] } },
    blockExplorers: {
      default: {
        name: 'Scrollscan',
        url: 'https://scrollscan.com',
      },
    },
  },
  {
    id: 7777777,
    name: 'Zora',
    network: 'zora',
    nativeCurrency: { "name": "Ether", "symbol": "ETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.zora.energy'] }, public: { http: ['https://rpc.zora.energy'] } },
    blockExplorers: {
      default: {
        name: 'Zora Network Explorer',
        url: 'https://explorer.zora.energy',
      },
    },
  },
  {
    id: 61,
    name: 'Ethereum Classic',
    network: 'ethclassic',
    nativeCurrency: { "name": "Ether", "symbol": "ETC", "decimals": 18 },
    rpcUrls: { default: { http: ['https://etc.etcdesktop.com'] }, public: { http: ['https://etc.etcdesktop.com'] } },
    blockExplorers: {
      default: {
        name: 'blockscout-ethereum-classic',
        url: 'https://etc.blockscout.com',
      },
    },
  },
  {
    id: 122,
    name: 'Fuse',
    network: 'fuse',
    nativeCurrency: { "name": "Fuse", "symbol": "FUSE", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.fuse.io'] }, public: { http: ['https://rpc.fuse.io'] } },
    blockExplorers: {
      default: {
        name: 'blockscout',
        url: 'https://explorer.fuse.io',
      },
    },
  },
  {
    id: 32659,
    name: 'Fusion',
    network: 'fusion',
    nativeCurrency: { "name": "Fusion", "symbol": "FSN", "decimals": 18 },
    rpcUrls: { default: { http: ['https://mainnet.fusionnetwork.io'] }, public: { http: ['https://mainnet.fusionnetwork.io'] } },
    blockExplorers: {
      default: {
        name: 'fsnscan',
        url: 'https://fsnscan.com',
      },
    },
  },
  {
    id: 8217,
    name: 'Klaytn',
    network: 'klaytn',
    nativeCurrency: { "name": "KLAY", "symbol": "KLAY", "decimals": 18 },
    rpcUrls: { default: { http: ['https://public-en-cypress.klaytn.net'] }, public: { http: ['https://public-en-cypress.klaytn.net'] } },
    blockExplorers: {
      default: {
        name: 'Klaytnscope',
        url: 'https://scope.klaytn.com',
      },
    },
  },
  {
    id: 34443,
    name: 'Mode',
    network: 'mode',
    nativeCurrency: { "name": "Ether", "symbol": "ETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://mainnet.mode.network'] }, public: { http: ['https://mainnet.mode.network'] } },
    blockExplorers: {
      default: {
        name: 'modescout',
        url: 'https://explorer.mode.network',
      },
    },
  },
  {
    id: 3109,
    name: 'SatoshiVM',
    network: 'satoshivm',
    nativeCurrency: { "name": "BTC", "symbol": "BTC", "decimals": 18 },
    rpcUrls: { default: { http: ['https://alpha-rpc-node-http.svmscan.io'] }, public: { http: ['https://alpha-rpc-node-http.svmscan.io'] } },
    blockExplorers: {
      default: {
        name: 'Explorer',
        url: 'https://svmscan.io/',
      },
    },
  },
  {
    id: 40,
    name: 'Telos EVM',
    network: 'telos',
    nativeCurrency: { "name": "Telos", "symbol": "TLOS", "decimals": 18 },
    rpcUrls: { default: { http: ['https://mainnet.telos.net/evm'] }, public: { http: ['https://mainnet.telos.net/evm'] } },
    blockExplorers: {
      default: {
        name: 'teloscan',
        url: 'https://teloscan.io',
      },
    },
  },
  {
    id: 1101,
    name: 'Polygon zkEVM',
    network: 'polygon_zkevm',
    nativeCurrency: { "name": "ETH", "symbol": "ETH", "decimals": 18 },
    rpcUrls: { default: { http: ['https://rpc.ankr.com/polygon_zkevm'] }, public: { http: ['https://rpc.ankr.com/polygon_zkevm'] } },
    blockExplorers: {
      default: {
        name: 'polygonscan',
        url: 'https://zkevm.polygonscan.com/',
      },
    },
  },
];
