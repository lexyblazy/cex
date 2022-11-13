import * as typeorm from "typeorm";
import { Lock } from "redlock";

import { addressEntity, AssetEntity, assetEntity } from "#/db/schemas";
import { withLock } from "#/redisHelper/locker";

import { MINIMUM_FREE_ADDRESSES_THRESHOLD } from "../constants";
import { createAddressEntities } from "./createAddressEntties";

export const generateNewAddresses = async () => {
  const typeormConnection = typeorm.getConnection();
  const assetsRepository = typeormConnection.getRepository(assetEntity);
  const assets = await assetsRepository.find({});

  const promises = assets.map((asset) => generateNewAddressPerAsset(asset));

  await Promise.all(promises);
};

const generateNewAddressPerAsset = async (assetEntity: AssetEntity) => {
  const lockResource = `generateNewAddress:${assetEntity.networkSymbol}`;

  return withLock(
    lockResource,
    async (lock: Lock | null) => {
      if (!lock) {
        console.log(`Failed to acquire lock on ${lockResource}`);
        return null;
      }

      console.log("Lock expiration", Date.now() - lock.expiration);
      console.log("Lock attempts", await lock.attempts);

      const typeormConnection = typeorm.getConnection();
      const addressesRepository = typeormConnection.getRepository(addressEntity);
      const freeAddressesCount = await addressesRepository.count({
        where: {
          user: typeorm.IsNull(),
          asset: assetEntity,
        },
      });

      const assetFreeAddressesThreshold =
        MINIMUM_FREE_ADDRESSES_THRESHOLD[assetEntity.networkSymbol];

      const shouldGenerateNewAddresses = freeAddressesCount < assetFreeAddressesThreshold;

      if (!shouldGenerateNewAddresses) {
        console.log(
          `${assetEntity.networkSymbol} has ${freeAddressesCount} free addresses, no need to generate new ones`
        );
        return;
      }

      if (shouldGenerateNewAddresses) {
        const lastAddress = await addressesRepository.findOne({
          where: {
            asset: assetEntity,
          },
          order: {
            index: "DESC",
          },
        });
        const lastIndex = lastAddress?.index ?? 0;

        const noOfAddressesToGenerate = lastIndex + assetFreeAddressesThreshold;
        console.log(`Generating ${noOfAddressesToGenerate} new address...`);

        const addressEntities = createAddressEntities(assetEntity, noOfAddressesToGenerate);

        return await addressesRepository.save(addressEntities);
      }
    },
    500
  );
};
