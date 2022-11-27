import * as express from "express";
import HttpStatus from "http-status-codes";
import * as typeorm from "typeorm";

import { sessionEntity } from "#/db/schemas";

export const checkAuth: express.RequestHandler = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  const typeormConnection = typeorm.getConnection();
  const sessionsRepository = typeormConnection.getRepository(sessionEntity);

  const session = await sessionsRepository.findOne({
    where: {
      token: authToken,
    },
    relations: ["user"],
  });

  if (!session) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }

  await sessionsRepository.update({ id: session.id }, { lastActive: new Date() });

  req.session = session;
  next();
};
