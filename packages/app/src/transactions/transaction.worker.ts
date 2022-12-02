import { getClient, constants as redisConstants } from "#/redisHelper";
import { getWorker, constants } from "#/workers";

import { signTransaction } from "./helpers";
import { TransactionsJobPipeline } from "./types";

export const start = () => {
  const transactionWorker = getWorker<TransactionsJobPipeline>(constants.TRANSACTIONS_JOB_PIPELINE);

  initPubSub();

  transactionWorker.process(constants.MAX_JOBS_PER_WORKER, (job) => {
    const { action, payload } = job.data;

    switch (action) {
      case "signTransaction":
        return signTransaction(payload);
      default:
        console.log(`Unknown action=${action}`);
        break;
    }
  });
};

const initPubSub = () => {
  const SIGNED_TRANSACTION_CHANNEL = "signed_transaction_channel";

  const subscriber = getClient(redisConstants.REDIS_CLIENT_NAME_SIGNER_SUBSCRIBER);

  subscriber.subscribe(SIGNED_TRANSACTION_CHANNEL, (err, count) => {
    if (err) {
      console.error("Failed to subscribe: %s", err.message);
    } else {
      console.log(`[${SIGNED_TRANSACTION_CHANNEL}]: Subscribed successfully!`);
    }
  });

  subscriber.on("message", (channel, message) => {
    console.log(`Received signed transaction, ${message}`);
  });
};
