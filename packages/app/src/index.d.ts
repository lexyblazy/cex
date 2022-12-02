import { schemas } from "@cex/db-lib";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
  namespace Express {
    export interface Request {
      session?: schemas.SessionEntity;
    }
  }
}
