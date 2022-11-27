import * as express from "express";
import HttpStatus from "http-status-codes";
import _ from "lodash";
import * as typeorm from "typeorm";

import { AddressEntity, addressEntity, assetEntity } from "#/db/schemas";
import { isValidUUid } from "#/utils";
import { getOneWithLock } from "#/db/utils";

export const getDepositAddress: express.RequestHandler = async (req, res) => {
  const { assetId } = req.params;

  if (!isValidUUid(assetId)) {
    return res.status(HttpStatus.BAD_REQUEST).send({ error: "Invalid asset" });
  }

  const user = req.session?.user!;

  const typeormConnection = typeorm.getConnection();
  const assetsRepository = typeormConnection.getRepository(assetEntity);
  const addressRepository = typeormConnection.getRepository(addressEntity);

  const asset = await assetsRepository.findOne({ id: assetId });

  if (!asset) {
    console.log(`AssetId = ${assetId} does not exist`);
    return res.status(HttpStatus.BAD_REQUEST).send({ error: "Invalid asset" });
  }

  const userDepositAddress = await addressRepository.findOne({
    where: {
      user,
      asset,
    },
    relations: ["asset"],
  });

  if (userDepositAddress) {
    return res.send(userDepositAddress);
  }

  const freeAddress = await addressRepository.findOne({
    where: {
      user: typeorm.IsNull(),
      asset,
    },
    relations: ["asset"],
  });

  if (!freeAddress) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
  }

  const result = await getOneWithLock<AddressEntity>({
    repository: addressRepository,
    where: {
      id: freeAddress.id,
    },
    relations: ["asset"],
    callback: async (addressEntityLocked, transactionalEntityManager) => {
      if (!addressEntityLocked) {
        return null;
      }

      const transactionalAddressRepository =
        transactionalEntityManager.getRepository(addressEntity);

      addressEntityLocked.user = user;

      return transactionalAddressRepository.save(addressEntityLocked);
    },
  });

  return res.send(_.omit(result, "user"));
};
