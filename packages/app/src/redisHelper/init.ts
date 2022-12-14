/**
 * NOTE - client and connection are used interchangeably
 * general idea is to maintain a fixed and limited number of redis clients(or connections) as opposed to
 * just spinning up new connections without any control
 * each bull queue/worker combination  requires 3 connections, of which two can be shared, but bclients cannot be shared
 *
 */
import Redis, { RedisOptions } from "ioredis";
import {
  ADDRESSES_JOB_PIPELINE,
  SESSIONS_JOB_PIPELINE,
  TRANSACTIONS_JOB_PIPELINE,
} from "#/workers/constants";

import * as constants from "./constants";
import { addBclientSuffix, getBullClientOptions } from "./bullHelper";
import { init as initLocker } from "./locker";

const REDIS_CLIENTS_NAMES = [
  "default", // default redis client

  // bull clients
  constants.REDIS_CLIENT_NAME_BULL,
  constants.REDIS_CLIENT_NAME_BULL_SUBSCRIBER,
  addBclientSuffix(ADDRESSES_JOB_PIPELINE),
  addBclientSuffix(SESSIONS_JOB_PIPELINE),
  addBclientSuffix(TRANSACTIONS_JOB_PIPELINE),

  // redis client for app-> signer pub/sub
  constants.REDIS_CLIENT_NAME_SIGNER_PUBLISHER,
  constants.REDIS_CLIENT_NAME_SIGNER_SUBSCRIBER,
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

const initRedis = () => {
  for (const name of REDIS_CLIENTS_NAMES) {
    const client = createClient(name);
    redisClients[name] = client;
  }
};

export const init = () => {
  initRedis();
  initLocker();
};
