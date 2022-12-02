import { EntitySchema } from "typeorm";

import { UserEntity } from "./types";

export const userEntity = new EntitySchema<UserEntity>({
  name: "users",

  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
      nullable: false,
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },

    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },

    email: {
      type: String,
      unique: true,
      nullable: false,
    },

    password: {
      type: String,
      nullable: false,
    },

    firstName: {
      type: String,
      nullable: false,
    },

    lastName: {
      type: String,
      nullable: false,
    },
  },
});
