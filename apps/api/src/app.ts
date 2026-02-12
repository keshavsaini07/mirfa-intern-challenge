import Fastify from "fastify";
import cors from "@fastify/cors";
import envPlugin from "./plugins/env.plugin";
import routes from "./routes";
import { buildConfig } from "./config/config";
import errorHandlerPlugin from "./plugins/error-handler.plugin";
import { createDb } from "./db";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(cors, {
    origin: true,
  });
  app.register(envPlugin);
  app.register(routes, { prefix: "/api" });

  app.register(errorHandlerPlugin);

  app.after(() => {
    const config = buildConfig(app);
    app.decorate("appConfig", config);
  });

  app.after(() => {
    const db = createDb(app.appConfig.databaseUrl);
    app.decorate("db", db);
  });

  return app;
}
