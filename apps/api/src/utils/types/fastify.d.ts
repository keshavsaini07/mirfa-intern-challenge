import "fastify";
import { AppConfig } from "../../config/config";

declare module "fastify" {
  interface FastifyInstance {
    appConfig: AppConfig;
    config: {
      PORT: number;
      MASTER_KEY: string;
    };
  }
}
