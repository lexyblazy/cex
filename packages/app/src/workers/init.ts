import Queue from "bull";
import { queueCreateRedisClient } from "../redisHelper";
import { ADDRESSES_JOB_PIPELINE } from "./constants";

const workers: { [key in string]: Queue.Queue } = {};

export const initWorkers = () => {
  const workerNames = [ADDRESSES_JOB_PIPELINE];

  for (const name of workerNames) {
    workers[name] = createWorker(name);
  }
};

const createWorker = (name: string) => {
  return new Queue(name, {
    createClient: queueCreateRedisClient(name),
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  });
};

export const getWorker = (name: string) => {
  const worker =  workers[name];

  if(!worker){
    throw new Error(`${name} worker does not exist`)
  }

  return worker
};
