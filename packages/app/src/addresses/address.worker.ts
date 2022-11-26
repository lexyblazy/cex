import { AddressJobPipeline, generateNewAddresses } from "#/addresses";
import { ADDRESSES_JOB_PIPELINE, MAX_JOBS_PER_WORKER } from "../workers/constants";
import { getWorker } from "../workers/init";

export const start = async () => {
  const addressWorker = getWorker<AddressJobPipeline>(ADDRESSES_JOB_PIPELINE);

  addressWorker.add(
    {
      action: "generateNewAddresses",
    },
    {
      repeat: {
        cron: "*/1 * * * *",
      },
    }
  );

  addressWorker.process(MAX_JOBS_PER_WORKER, (job) => {
    const { action } = job.data;

    switch (action) {
      case "generateNewAddresses":
        return generateNewAddresses();
      default:
        console.log(`Unknown action=${action}`);
        break;
    }
  });
};
