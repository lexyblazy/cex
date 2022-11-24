import * as typeorm from "typeorm";
import * as uuid from "uuid";

import { sessionEntity, UserEntity } from "#/db/schemas";

export const createSession = async (
  user: UserEntity,
  transactionalEntityManger?: typeorm.EntityManager
) => {
  const typeormConnection = transactionalEntityManger ?? typeorm.getConnection();
  const sessionsRepository = typeormConnection.getRepository(sessionEntity);

  return sessionsRepository.save({
    user,
    token: uuid.v4(),
  });
};
