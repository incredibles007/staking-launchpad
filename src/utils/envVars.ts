export const IS_MAINNET                 = Boolean(process.env.REACT_APP_IS_MAINNET === 'true');

// private vars (or derived from)
export const PORTIS_DAPP_ID             = process.env.REACT_APP_PORTIS_DAPP_ID     || '';
export const INFURA_PROJECT_ID          = process.env.REACT_APP_INFURA_PROJECT_ID  || '';
export const ENABLE_RPC_FEATURES        = Boolean(INFURA_PROJECT_ID && INFURA_PROJECT_ID !== '');
export const INFURA_URL                 = `https://${IS_MAINNET ? "mainnet" : "goerli"}.infura.io/v3/${INFURA_PROJECT_ID}`;

// public
export const ALETHIO_URL                = IS_MAINNET ? 'https://explorer.aleth.io/tx' : 'https://explorer.goerli.aleth.io/tx';
export const ETHERSCAN_URL              = IS_MAINNET ? 'https://etherscan.io/tx' : 'https://goerli.etherscan.io/tx';
export const FORTMATIC_KEY              = process.env.REACT_APP_FORTMATIC_KEY       || 'pk_test_D113D979E0D3508F';
export const CONTRACT_ADDRESS           = process.env.REACT_APP_CONTRACT_ADDRESS    || '0x344b3a521ded954b4fa9ec8cc1d999631c998daa';
export const ETH2_NETWORK_NAME          = process.env.REACT_APP_ETH2_NETWORK_NAME   || 'mainnet';
export const ETH_REQUIREMENT            = process.env.REACT_APP_ETH_REQUIREMENT     || 524288;
export const PRICE_PER_VALIDATOR        = process.env.REACT_APP_PRICE_PER_VALIDATOR || 32;

// BLS signature verification variables
export const ETHER_TO_GWEI              = 1e9;
export const MIN_DEPOSIT_AMOUNT         = 1 * ETHER_TO_GWEI;
export const DOMAIN_DEPOSIT             = Buffer.from('03000000', 'hex');
export const EMPTY_ROOT                 = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
export const GENESIS_FORK_VERSION       = process.env.REACT_APP_GENESIS_FORK_VERSION || Buffer.from('00000000', 'hex');
