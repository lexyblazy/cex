import { schemas } from "@cex/db-lib";
import * as typeorm from "typeorm";
import * as uuid from "uuid";

export const createSession = async (
  user: schemas.UserEntity,
  transactionalEntityManger?: typeorm.EntityManager
) => {
  const typeormConnection = transactionalEntityManger ?? typeorm.getConnection();
  const sessionsRepository = typeormConnection.getRepository(schemas.sessionEntity);

  return sessionsRepository.save({
    user,
    token: uuid.v4(),
  });
};
