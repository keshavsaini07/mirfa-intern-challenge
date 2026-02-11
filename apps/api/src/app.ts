import Fastify from "fastify";
import envPlugin from "./plugins/env.plugin";
import routes from "./routes";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(envPlugin);
  app.register(routes, { prefix: "/api" });

  return app;
}
