import { EntitySchema } from "typeorm";
import { AssetEntity } from "./types";

export const assetEntity = new EntitySchema<AssetEntity>({
  name: "assets",
  columns: {
    id: {
      type: "uuid",
      generated: "uuid",
      nullable: false,
      primary: true,
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },

    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },

    name: {
      type: String,
      nullable: false,
    },

    description: {
      type: String,
      nullable: true,
    },

    networkSymbol: {
      type: String,
      nullable: false,
    },

    requiredConfirmations: {
      type: "smallint",
      nullable: false,
    },

    symbol: {
      type: String,
      nullable: false,
    },

    tokenId: {
      type: String,
      nullable: true,
    },
  },
});
