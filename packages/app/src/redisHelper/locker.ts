import Redlock, { Lock, ResourceLockedError } from "redlock";
import { getClient } from "./init";

const redisClient = getClient();

const DEFAULT_LOCK_DURATION = 1000;

const redlock = new Redlock([redisClient], {
  driftFactor: 0.01,

  retryCount: 10,

  retryDelay: 200,

  retryJitter: 200,
  automaticExtensionThreshold: 500,
});

export const withLock = async <T>(
  lockResource: string,
  callback: (lock: Lock) => Promise<T>,
  duration = DEFAULT_LOCK_DURATION
) => {
  let lock: Lock | null = null;
  try {
    lock = await redlock.acquire([lockResource], duration);
    return callback(lock);
  } catch (error) {
    console.log(`Failed to acquire lock on ${lockResource}`);
    return null;
  } finally {
    if (lock) {
      await lock.release();
    }
  }
};

redlock.on("error", (error) => {
  if (error instanceof ResourceLockedError) {
    return;
  }

  console.error(error);
});
