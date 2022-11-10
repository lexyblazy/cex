// address worker
// transaction worker
// session worker - revalidate sessions
import throng from "throng";
import { initServices } from "./init";
import { addressWorker } from "./workers";

/**
 * not all workers requires multiple worker processes.
 * Some workers e.g address generation requires only one worker to ensure we don't generate the same addresses multiple times
 * 
 */
function withThrong<T>(fn: () => T, workersCount?: number) {
  return throng({
    start: () => {
      return fn();
    },
    workers: workersCount ?? process.env.WORKERS_PROCESSES_COUNT,
  });
}

const main = async () => {
  await initServices();

  return Promise.all([addressWorker.start()]);
};

main().catch(console.error);
