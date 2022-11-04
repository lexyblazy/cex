import { EntitySchema } from "typeorm";
import { SessionEntity } from "./types";

export const sessionEntity = new EntitySchema<SessionEntity>({
  name: "session",

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

    lastActive: {
      type: "timestamp",
      createDate: true,
    },

    mfaVerified: {
      type: Boolean,
      default: false,
    },

    token: {
      type: String,
      nullable: false,
    },
  },
});
