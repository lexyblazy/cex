/**
 * NOTE - client and connection are used interchangeably
 * general idea is to maintain a fixed and limited number of redis clients(or connections) as opposed to
 * just spinning up new connections without any control
 * each bull queue/worker combination  requires 3 connections, of which two can be shared, but bclients cannot be shared
 *
 *
 */
import Redis, { RedisOptions } from "ioredis";

import { QueueOptions } from "bull";
import * as workers from "./workers";

const addBclientSuffix = (name: string) => `${name}-bclient`;

const REDIS_CLIENTS_NAMES = [
  "default",
  workers.constants.REDIS_CLIENT_NAME_BULL,
  workers.constants.REDIS_CLIENT_NAME_BULL_SUBSCRIBER,
  addBclientSuffix(workers.constants.ADDRESSES_JOB_PIPELINE),
];

const redisClients: { [key in string]: Redis } = {};

const createClient = (name: string) => {
  const { REDIS_URL } = process.env;

  if (!REDIS_URL) {
    throw new Error("REDIS_URL is undefined");
  }
  const parsedURL = new URL(REDIS_URL);
  const bullClientOptions = getBullClientOptions(name);

  const client = new Redis({
    host: parsedURL.hostname,
    port: Number(parsedURL.port),
    reconnectOnError: (error) => {
      console.log(`Redis ${name} client error`, error);
      return true;
    },
    ...bullClientOptions,
  });

  return client;
};

export const getClient = (name: string = "default") => redisClients[name];

export const queueCreateRedisClient =
  (clientName: string): QueueOptions["createClient"] =>
  (type: "client" | "subscriber" | "bclient", _redisOpts: RedisOptions) => {
    switch (type) {
      case "client":
        return getClient(workers.constants.REDIS_CLIENT_NAME_BULL);
      case "subscriber":
        return getClient(workers.constants.REDIS_CLIENT_NAME_BULL_SUBSCRIBER);
      case "bclient":
        return getClient(addBclientSuffix(clientName));
      default:
        throw new Error(`Unexpected connection type: ${type}`);
    }
  };

const isBullClient = (clientName: string): boolean => {
  return clientName.includes("bclient") || clientName.includes("bull");
};

const getBullClientOptions = (clientName: string) => {
  if (isBullClient(clientName)) {
    return {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      keyPrefix: undefined,
    };
  }
  return {};
};

export const initRedis = () => {
  for (const name of REDIS_CLIENTS_NAMES) {
    const client = createClient(name);
    redisClients[name] = client;
  }
};
