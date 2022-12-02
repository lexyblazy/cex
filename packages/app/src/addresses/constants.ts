import { schemas } from "@cex/db-lib";

export const MINIMUM_FREE_ADDRESSES_THRESHOLD: {
  [key in schemas.AssetEntity["networkSymbol"]]: number;
} = {
  BTC: 30,
  ETH: 30,
};

export const ADDRESS_UUID_NAME_SPACE = "30df2648-f4d8-4c83-af4a-8be1f04e704d";
