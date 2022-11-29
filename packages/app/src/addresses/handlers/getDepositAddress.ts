import * as express from "express";
import HttpStatus from "http-status-codes";
import _ from "lodash";
import * as typeorm from "typeorm";

import { AddressEntity, addressEntity, assetEntity } from "#/db/schemas";
import { getOneWithLock } from "#/db/utils";
import { isValidUUid } from "#/utils";
import { withRedlock } from "#/redisHelper/locker";

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

  /**
   *  Initially Implemented this to use only a database row level lock `getOneWithLock` ,
   * so other attempts to lock the row will be queued up until the current operation releases the lock.
   *
   *  However this will stress the database if there are multiple requests
   * (with each one attempting to obtain a exclusive lock  on the resource)
   *
   * So I decided to leverage redlock to implement a lock at the application level,
   * then return a `rateLimited` response
   *
   */

  const lockResource = `getDepositAddress:${freeAddress.address}`;

  const result = await withRedlock(lockResource, async (lock) => {
    if (!lock) {
      return null;
    }

    const dbLockResult = await getOneWithLock<AddressEntity>({
      repository: addressRepository,
      where: {
        id: freeAddress.id,
      },
      relations: ["asset"],
      callback: async (addressEntityLocked, transactionalEntityManager) => {
        if (!addressEntityLocked) {
          console.log(`Failed to get address Entity locked, id =${freeAddress.id}`);
          return null;
        }

        const transactionalAddressRepository =
          transactionalEntityManager.getRepository(addressEntity);

        addressEntityLocked.user = user;

        return transactionalAddressRepository.save(addressEntityLocked);
      },
    });

    return dbLockResult;
  });

  if (!result) {
    return res.status(HttpStatus.TOO_MANY_REQUESTS).send({ error: "rateLimited" });
  }

  return res.send(_.omit(result, "user"));
};
