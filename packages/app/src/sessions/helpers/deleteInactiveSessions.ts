import moment from "moment";
import * as typeorm from "typeorm";

import { sessionEntity } from "#/db/schemas";

export const deleteInActiveSessions = async () => {
  const typeormConnection = typeorm.getConnection();
  const sessionsRepository = typeormConnection.getRepository(sessionEntity);
  const MIN_SESSION_VALIDITY_HOURS = 1;

  const minSessionValidityTimestamp = moment(Date.now())
    .subtract(MIN_SESSION_VALIDITY_HOURS, "hours")
    .toDate();

  await sessionsRepository.delete({
    lastActive: typeorm.LessThan(minSessionValidityTimestamp),
  });

  console.log("Deleted Inactive Sessions");
};
