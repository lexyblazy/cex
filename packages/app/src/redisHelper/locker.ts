import Redlock, { Lock, ResourceLockedError, Settings as RedLockSettings } from "redlock";
import { getClient } from "./init";

const DEFAULT_LOCK_DURATION = 3000;

const redlockSettings: RedLockSettings = {
  driftFactor: 0.01,

  retryCount: 10,

  retryDelay: 200,

  retryJitter: 200,
  automaticExtensionThreshold: 500,
};

let redlockInstance: Redlock;

export const withRedlock = async <T>(
  lockResource: string,
  callback: (lock: Lock | null) => Promise<T>,
  duration = DEFAULT_LOCK_DURATION
) => {
  let lock: Lock | null = null;
  try {
    const fullLockResource = prefixLockResource(lockResource);

    lock = await redlockInstance.acquire([fullLockResource], duration);

    const result = await callback(lock);

    return result;
  } catch (error) {
    /**
     * I experienced this error — ExecutionError: The operation was unable to achieve a quorum during its retry window.
     * When I was trying to acquire a lock on the same resource concurrently,
     * Ideally this should have been an instance of `ResourceLockedError`
     * and should not throw an error or break control flow but for some reason it did.
     * So I decided to catch it and return null
      https://github.com/mike-marcacci/node-redlock/issues/168
     */
    console.error("Redlock Error", error);
    return null;
  } finally {
    if (lock) {
      await lock.release();
    }
  }
};

const prefixLockResource = (lockResource: string) => `Redlock:${lockResource}`;

const getLockResource = (lock: Lock) => lock.resources[0];

export const extendLock = async (lock: Lock, lockResource: string, duration: number) => {
  const isCorrectResource = getLockResource(lock) === prefixLockResource(lockResource);

  if (!isCorrectResource) {
    throw new Error(
      `Lock resource mismatch!!!, ${getLockResource(lock)} is NOT similar to ${prefixLockResource(
        lockResource
      )} `
    );
  }

  if (isLockStillValid(lock)) {
    await lock.extend(duration);
  } else {
    throw new Error(`Lock on ${lockResource} has already expired`);
  }
};

export const isLockStillValid = (lock: Lock) => {
  const remainingTimeMS = lock.expiration - Date.now();

  return remainingTimeMS > 0;
};

export const init = () => {
  const redisClient = getClient();

  redlockInstance = new Redlock([redisClient], redlockSettings);

  redlockInstance.on("error", (error) => {
    if (error instanceof ResourceLockedError) {
      return;
    }

    console.error("Redlock Error", error);
  });
};
