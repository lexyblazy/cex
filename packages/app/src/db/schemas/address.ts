import { EntitySchema } from "typeorm";
import { AddressEntity } from "./types";

export const addressEntity = new EntitySchema<AddressEntity>({
  name: "addresses",
  columns: {
    // for the id field, it is deterministically generated using a uuid.v3(address, address_name_space)
    id: {
      type: "uuid",
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

    address: {
      type: String,
      nullable: false,
    },

    index: {
      type: "integer",
    },
  },

  relations: {
    asset: {
      type: "many-to-one",
      target: "assets",
      joinColumn: true,
      nullable: false,
    },

    user: {
      type: "many-to-one",
      target: "users",
      joinColumn: true,
      nullable: true,
    },
  },
});
