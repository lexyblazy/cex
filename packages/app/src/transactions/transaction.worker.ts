import { getWorker, constants } from "#/workers";

import { create } from "./helpers";
import { TransactionsJobPipeline } from "./types";

export const start = () => {
  const transactionWorker = getWorker<TransactionsJobPipeline>(constants.TRANSACTIONS_JOB_PIPELINE);

  transactionWorker.process(constants.MAX_JOBS_PER_WORKER, (job) => {
    const { action, payload } = job.data;

    switch (action) {
      case "createTransaction":
        return create(payload);
      default:
        console.log(`Unknown action=${action}`);
        break;
    }
  });
};
