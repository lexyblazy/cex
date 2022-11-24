import bcrypt from "bcrypt";
import * as express from "express";
import * as typeorm from "typeorm";
import HttpStatus from "http-status-codes";

import { UserEntity, userEntity } from "#/db/schemas";

import { UserSignupParams } from "./types";

export const signup: express.RequestHandler = async (req, res) => {
  const typeormConnection = typeorm.getConnection();

  const { email, firstName, lastName, password }: UserSignupParams = req.body;

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

  console.log({ hashedPassword });

  const newUser: Partial<UserEntity> = {
    email,
    firstName,
    lastName,
    password: hashedPassword,
  };

  await usersRepository.save(newUser);

  res.send("OK");
};
