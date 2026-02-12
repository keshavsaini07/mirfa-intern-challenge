import Fastify from "fastify";
import cors from "@fastify/cors";
import envPlugin from "./plugins/env.plugin";
import routes from "./routes";
import { buildConfig } from "./config/config";
import errorHandlerPlugin from "./plugins/error-handler.plugin";
import dbPlugin from "./plugins/db.plugin";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(cors, {
    origin: true,
  });
  app.register(envPlugin);
  app.register(dbPlugin);
  app.register(routes, { prefix: "/api" });

  app.register(errorHandlerPlugin);
  return app;
}
