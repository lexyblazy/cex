// import { BitcoinHdWalletUtils, EthereumHdWalletUtils } from "@cex/crypto-lib";
import { ADDRESSES_JOB_PIPELINE, MAX_JOBS_PER_WORKER } from "./constants";
import { getWorker } from "./init";

export const start = async () => {
  const addressWorker = getWorker(ADDRESSES_JOB_PIPELINE);

  await addressWorker.add(
    {
      luckyNumber: Math.random(),
    },
    {}
  );

  addressWorker.process(MAX_JOBS_PER_WORKER, (job) => {
    const jobData = job.data;

    console.log(jobData, job.id);
  });
};

// const deriveBitcoinAddresses = async () => {
//   const { BTC_XPUB } = process.env;
//   if (!BTC_XPUB) {
//     throw new Error("Environment variable BTC_XPUB is missing");
//   }
//   const bitcoinHdWalletUtils = new BitcoinHdWalletUtils(BTC_XPUB);

//   for (let i = 0; i < 10; i++) {
//     const address = bitcoinHdWalletUtils.deriveAddress(i, "legacy");
//     console.log(address);
//   }
// };

// const deriveEthereumAddresses = async () => {
//   const { ETH_XPUB } = process.env;
//   if (!ETH_XPUB) {
//     throw new Error("Environment variable ETH_XPUB is missing");
//   }

//   const ethHdWalletUtils = new EthereumHdWalletUtils(ETH_XPUB);

//   for (let i = 0; i < 10; i++) {
//     const address = ethHdWalletUtils.deriveAddress(i);
//     console.log(address);
//   }
// };
