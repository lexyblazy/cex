import { sessionEntity } from "#/db/schemas";
import * as express from "express";
import * as typeorm from "typeorm";

export const logout: express.RequestHandler = async (req, res) => {
  const typeormConnection = typeorm.getConnection();
  const sessionsRepository = typeormConnection.getRepository(sessionEntity);

  await sessionsRepository.delete({ id: req.session?.id });

  res.send("OK");
};
