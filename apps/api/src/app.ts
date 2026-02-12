import Fastify from "fastify";
import cors from "@fastify/cors";
import envPlugin from "./plugins/env.plugin";
import routes from "./routes";
import { buildConfig } from "./config/config";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(cors, {
    origin: true,
  });
  app.register(envPlugin);
  app.register(routes, { prefix: "/api" });

  app.after(() => {
    const config = buildConfig(app);
    app.decorate("appConfig", config);
  });

  return app;
}
