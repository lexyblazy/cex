import { BitcoinHdWalletUtils, EthereumHdWalletUtils } from "@cex/crypto-lib";
import { schemas } from "@cex/db-lib";
import { v3 as uuidV3 } from "uuid";

import { ADDRESS_UUID_NAME_SPACE } from "../constants";

const mapToAddressEntity = (
  address: string,
  index: number,
  assetEntity: schemas.AssetEntity
): Partial<schemas.AddressEntity> => {
  return {
    address,
    id: generateAddressUUID(address),
    index,
    asset: assetEntity,
  };
};

const deriveBitcoinAddresses = (count: number, assetEntity: schemas.AssetEntity) => {
  const { BTC_XPUB } = process.env;
  if (!BTC_XPUB) {
    throw new Error("Environment variable BTC_XPUB is missing");
  }
  const bitcoinHdWalletUtils = new BitcoinHdWalletUtils(BTC_XPUB);
  const addressesEntities: Partial<schemas.AddressEntity>[] = [];

  for (let i = 0; i < count; i++) {
    const address = bitcoinHdWalletUtils.deriveAddress(i, "segwitNative");
    if (!address) {
      throw new Error(`Failed to derive bitcoin address at index=${i}`);
    }

    addressesEntities.push(mapToAddressEntity(address, i, assetEntity));
  }

  return addressesEntities;
};

const deriveEthereumAddresses = (count: number, assetEntity: schemas.AssetEntity) => {
  const { ETH_XPUB } = process.env;
  if (!ETH_XPUB) {
    throw new Error("Environment variable ETH_XPUB is missing");
  }

  const ethHdWalletUtils = new EthereumHdWalletUtils(ETH_XPUB);
  const addressesEntities: Partial<schemas.AddressEntity>[] = [];

  for (let i = 0; i < count; i++) {
    const address = ethHdWalletUtils.deriveAddress(i);
    addressesEntities.push(mapToAddressEntity(address, i, assetEntity));
  }

  return addressesEntities;
};

const generateAddressUUID = (address: string) => uuidV3(address, ADDRESS_UUID_NAME_SPACE);

export const createAddressEntities = (assetEntity: schemas.AssetEntity, count: number) => {
  switch (assetEntity.networkSymbol) {
    case "BTC":
      return deriveBitcoinAddresses(count, assetEntity);
    case "ETH":
      return deriveEthereumAddresses(count, assetEntity);
    default:
      console.log(`Unknown asset=${assetEntity}`);
      return [];
  }
};
