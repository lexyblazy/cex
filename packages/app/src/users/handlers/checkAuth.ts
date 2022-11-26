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
  });

  if (!session) {
    return res.status(HttpStatus.UNAUTHORIZED).send();
  }
  req.session = session;
  next();
};
