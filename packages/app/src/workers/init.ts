import Queue from "bull";
import * as redisHelper from "#/redisHelper";
import { ADDRESSES_JOB_PIPELINE, SESSIONS_JOB_PIPELINE } from "./constants";

const workers: { [key in string]: Queue.Queue } = {};

export const init = () => {
  const workerNames = [ADDRESSES_JOB_PIPELINE, SESSIONS_JOB_PIPELINE];

  for (const name of workerNames) {
    workers[name] = createWorker(name);
  }

  console.log(`All workers are up and running`);
};

const createWorker = (name: string) => {
  return new Queue(name, {
    createClient: redisHelper.bull.queueCreateRedisClient(name),
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  });
};

export const getWorker = <T>(name: string) => {
  const worker = workers[name] as Queue.Queue<T>;

  if (!worker) {
    throw new Error(`${name} worker does not exist`);
  }

  return worker;
};
