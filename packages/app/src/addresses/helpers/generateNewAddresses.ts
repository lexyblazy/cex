import { schemas } from "@cex/db-lib";
import * as typeorm from "typeorm";
import { Lock } from "redlock";

import { withRedlock } from "#/redisHelper/locker";

import { MINIMUM_FREE_ADDRESSES_THRESHOLD } from "../constants";
import { createAddressEntities } from "./createAddressEntities";

export const generateNewAddresses = async () => {
  const typeormConnection = typeorm.getConnection();
  const assetsRepository = typeormConnection.getRepository(schemas.assetEntity);
  const assets = await assetsRepository.find({});

  const promises = assets.map((asset) => generateNewAddressPerAsset(asset));

  await Promise.all(promises);
};

const generateNewAddressPerAsset = async (assetEntity: schemas.AssetEntity) => {
  const lockResource = `generateNewAddress:${assetEntity.networkSymbol}`;

  return withRedlock(
    lockResource,
    async (lock: Lock | null) => {
      if (!lock) {
        console.log(`Failed to acquire lock on ${lockResource}`);
        return null;
      }

      const typeormConnection = typeorm.getConnection();
      const addressesRepository = typeormConnection.getRepository(schemas.addressEntity);
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
      console.log(
        `[${assetEntity.networkSymbol}]: Generating ${noOfAddressesToGenerate} new address...`
      );

      const addressEntities = createAddressEntities(assetEntity, noOfAddressesToGenerate);

      return addressesRepository.save(addressEntities);
    },
    5000
  );
};
