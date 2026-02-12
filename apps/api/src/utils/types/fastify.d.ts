import "fastify";
import { AppConfig } from "../../config/config";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

declare module "fastify" {
  interface FastifyInstance {
    appConfig: AppConfig;
    db: PostgresJsDatabase<any>;
    config: {
      DATABASE_URL: string;
      PORT: number;
      MASTER_KEY: string;
    };
  }
}
