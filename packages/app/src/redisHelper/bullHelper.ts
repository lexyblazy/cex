import { QueueOptions } from "bull";
import { RedisOptions } from "ioredis";

import * as constants from "./constants";
import { getClient } from "./init";

export const addBclientSuffix = (name: string) => `${name}-bclient`;

export const queueCreateRedisClient =
  (clientName: string): QueueOptions["createClient"] =>
  (type: "client" | "subscriber" | "bclient", _redisOpts: RedisOptions) => {
    switch (type) {
      case "client":
        return getClient(constants.REDIS_CLIENT_NAME_BULL);
      case "subscriber":
        return getClient(constants.REDIS_CLIENT_NAME_BULL_SUBSCRIBER);
      case "bclient":
        return getClient(addBclientSuffix(clientName));
      default:
        throw new Error(`Unexpected connection type: ${type}`);
    }
  };

const isBullClient = (clientName: string): boolean => {
  return clientName.includes("bclient") || clientName.includes("bull");
};

export const getBullClientOptions = (clientName: string) => {
  if (isBullClient(clientName)) {
    return {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      keyPrefix: undefined,
    };
  }
  return {};
};
