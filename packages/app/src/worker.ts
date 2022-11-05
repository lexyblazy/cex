// address worker
// transaction worker
// session worker - revalidate sessions
import throng from "throng";
import { initServices } from "./init";
import { addressWorker } from "./workers";

const main = async () => {
  await initServices();

  return throng({
    start: async () => {
      return Promise.all([addressWorker.start()]);
    },
    workers: process.env.WORKERS_PROCESSES_COUNT,
  });
};

main().catch(console.error);
