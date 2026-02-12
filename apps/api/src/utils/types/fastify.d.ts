import "fastify";
import { AppConfig } from "../../config/config";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import TxService from "../../services/tx.service";

declare module "fastify" {
  interface FastifyInstance {
    appConfig: AppConfig;
    db: PostgresJsDatabase<any>;
    txRepository: createTxRepository;
    txService: ReturnType<typeof TxService>;
    config: {
      DATABASE_URL: string;
      PORT: number;
      MASTER_KEY: string;
    };
  }
}
