import { schemas } from "@cex/db-lib";
import bcrypt from "bcryptjs";
import express from "express";
import HttpStatus from "http-status-codes";
import * as typeorm from "typeorm";

import { UserLoginParams } from "./types";
import { createSession } from "../helpers";

export const login: express.RequestHandler = async (req, res) => {
  const typeormConnection = typeorm.getConnection();
  const usersRepository = typeormConnection.getRepository(schemas.userEntity);

  const { email, password }: UserLoginParams = req.body;

  if (!email || !password) {
    return res.status(HttpStatus.BAD_REQUEST).send({ error: "missing email or password" });
  }

  const DEFAULT_ERROR_MESSAGE = { error: "Incorrect email or password combination" };

  const user = await usersRepository.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    return res.status(HttpStatus.UNAUTHORIZED).send(DEFAULT_ERROR_MESSAGE);
  }

  const isCorrectPassword = bcrypt.compareSync(password, user.password);

  if (!isCorrectPassword) {
    return res.status(HttpStatus.UNAUTHORIZED).send(DEFAULT_ERROR_MESSAGE);
  }

  const { token, lastActive } = await createSession(user);

  return res.send({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    session: {
      token,
      lastActive,
    },
  });
};
