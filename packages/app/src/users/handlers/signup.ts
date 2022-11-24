import bcrypt from "bcryptjs";
import * as express from "express";
import * as typeorm from "typeorm";
import HttpStatus from "http-status-codes";

import { UserEntity, userEntity } from "#/db/schemas";
import { runInTransaction } from "#/db/utils";

import { UserSignupParams } from "./types";
import { createSession } from "../helpers";

export const signup: express.RequestHandler = async (req, res) => {
  const typeormConnection = typeorm.getConnection();

  const { email, firstName, lastName, password }: UserSignupParams = req.body;

  if (!email || !firstName || !lastName || !password) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ error: "Missing email or firstName or lastName or password" });
  }

  const usersRepository = typeormConnection.getRepository(userEntity);

  const existingUser = await usersRepository.findOne({
    email,
  });

  if (existingUser) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
      message: "Email is already registered",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser: Partial<UserEntity> = {
    email: email.toLowerCase(),
    firstName: firstName.toLowerCase(),
    lastName: lastName.toLowerCase(),
    password: hashedPassword,
  };

  const { user, token, lastActive } = await runInTransaction(
    async (transactionalEntityManger: typeorm.EntityManager) => {
      const transactionalUsersRepository = transactionalEntityManger.getRepository(userEntity);

      const user = await transactionalUsersRepository.save(newUser);

      return createSession(user, transactionalEntityManger);
    }
  );

  res.send({
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
