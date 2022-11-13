import Redlock, { Lock, ResourceLockedError } from "redlock";
import { getClient } from "./init";

const DEFAULT_LOCK_DURATION = 1000;

let redlockInstance: Redlock;

export const withLock = async <T>(
  lockResource: string,
  callback: (lock: Lock | null) => Promise<T>,
  duration = DEFAULT_LOCK_DURATION
) => {
  let lock: Lock | null = null;
  try {
    const fullLockResource = `Redlock:${lockResource}`;

    lock = await redlockInstance.acquire([fullLockResource], duration);
    return await callback(lock);
  } finally {
    if (lock) {
      await lock.release();
    }
  }
};

export const init = () => {
  const redisClient = getClient();

  redlockInstance = new Redlock([redisClient], {
    driftFactor: 0.01,

    retryCount: 10,

    retryDelay: 200,

    retryJitter: 200,
    automaticExtensionThreshold: 500,
  });

  redlockInstance.on("error", (error) => {
    if (error instanceof ResourceLockedError) {
      return;
    }

    console.error(error);
  });
};
