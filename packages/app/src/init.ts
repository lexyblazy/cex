import { assetsList } from "@cex/crypto-lib";
import { schemas } from "@cex/db-lib";
import express from "express";
import * as typeorm from "typeorm";

import { init as initRedis } from "#/redisHelper";
import { init as initWorkers } from "#/workers";
import { addressesRouter } from "#/addresses";
import { usersRouter } from "#/users";

export const initServices = async () => {
  try {
    await initTypeorm();
    await loadAssets();
    initRedis();
    initWorkers();
  } catch (error) {
    console.error("Failed to init core requirements", error);
    process.exit(1);
  }
};

export const initTypeorm = async (databaseUrl?: string) => {
  const defaultConnectionOptions = await typeorm.getConnectionOptions();

  Object.assign(defaultConnectionOptions, {
    url: databaseUrl ?? process.env.DATABASE_URL,
  });

  await typeorm.createConnection(defaultConnectionOptions);
};

export const initRouters = (app: express.Application) => {
  app.use("/address", addressesRouter.create());

  app.use("/users", usersRouter.create());
};

const loadAssets = async () => {
  const typeormConnection = typeorm.getConnection();
  const assetsRepository = typeormConnection.getRepository(schemas.assetEntity);

  // refresh asset list on startup
  const existingAssetsList = await assetsRepository.find({});

  if (existingAssetsList.length === 0) {
    const assetEntities: Partial<schemas.AssetEntity>[] = assetsList.map(
      (a: Partial<schemas.AssetEntity>) => ({
        description: a.description,
        name: a.name,
        networkSymbol: a.networkSymbol,
        symbol: a.symbol,
        requiredConfirmations: a.requiredConfirmations,
      })
    );

    return assetsRepository.save(assetEntities);
  }

  // TODO: implement a small diff algorithm, to add new assets to db, when crypto-lib assets list is updated
};
