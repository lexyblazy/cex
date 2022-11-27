import { AddressJobPipeline, generateNewAddresses } from "#/addresses";
import { getWorker, constants } from "#/workers";

export const start = async () => {
  const addressWorker = getWorker<AddressJobPipeline>(constants.ADDRESSES_JOB_PIPELINE);

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

  addressWorker.process(constants.MAX_JOBS_PER_WORKER, (job) => {
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
