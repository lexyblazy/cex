import { getWorker, constants } from "#/workers";
import { deleteInActiveSessions } from "./helpers";
import { SessionsJobPipeline } from "./types";

export const start = () => {
  const sessionWorker = getWorker<SessionsJobPipeline>(constants.SESSIONS_JOB_PIPELINE);
  sessionWorker.add(
    {
      action: "deleteInActiveSessions",
    },
    {
      repeat: {
        cron: "*/1 * * * *", // todo: finetune this later to every hour or two hours
      },
    }
  );

  sessionWorker.process(constants.MAX_JOBS_PER_WORKER, (job) => {
    const { action } = job.data;

    switch (action) {
      case "deleteInActiveSessions":
        return deleteInActiveSessions();
      default:
        console.log(`Unknown action=${action}`);
        break;
    }
  });
};
