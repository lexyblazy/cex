import { BitcoinHdWalletUtils, EthereumHdWalletUtils } from "@cex/crypto-lib";

const deriveBitcoinAddresses = async () => {
  const { BTC_XPUB } = process.env;
  if (!BTC_XPUB) {
    throw new Error("Environment variable BTC_XPUB is missing");
  }
  const bitcoinHdWalletUtils = new BitcoinHdWalletUtils(BTC_XPUB);

  for (let i = 0; i < 10; i++) {
    const address = bitcoinHdWalletUtils.deriveAddress(i, "legacy");
    console.log(address);
  }
};

const deriveEthereumAddresses = async () => {
  const { ETH_XPUB } = process.env;
  if (!ETH_XPUB) {
    throw new Error("Environment variable ETH_XPUB is missing");
  }

  const ethHdWalletUtils = new EthereumHdWalletUtils(ETH_XPUB);

  for (let i = 0; i < 10; i++) {
    const address = ethHdWalletUtils.deriveAddress(i);
    console.log(address);
  }
};

export const start = () => {
  deriveBitcoinAddresses();
  deriveEthereumAddresses();
};
