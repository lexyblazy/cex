import { assetsList } from "@cex/crypto-lib";
import { assetEntity, AssetEntity } from "#/db/schemas";

import * as typeorm from "typeorm";
import { init as initRedis } from "#/redisHelper";
import { init as initWorkers } from "#/workers";

export const initServices = async () => {
  try {
    await initTypeorm();
    initRedis();
    initWorkers();
    // await loadAssets();
  } catch (error) {
    console.error("Failed to init core requirements", error);
    process.exit(1);
  }
};

export const initTypeorm = async () => {
  const defaultConnectionOptions = await typeorm.getConnectionOptions();

  Object.assign(defaultConnectionOptions, {
    url: process.env.DATABASE_URL,
  });

  await typeorm.createConnection(defaultConnectionOptions);
};

const loadAssets = async () => {
  const typeormConnection = typeorm.getConnection();
  const assetsRepository = typeormConnection.getRepository(assetEntity);
  const assetEntities: Partial<AssetEntity>[] = assetsList.map((a: Partial<AssetEntity>) => ({
    description: a.description,
    name: a.name,
    networkSymbol: a.networkSymbol,
    symbol: a.symbol,
    requiredConfirmations: a.requiredConfirmations,
  }));

  await assetsRepository.save(assetEntities);
};
