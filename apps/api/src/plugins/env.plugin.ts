import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";
import { buildConfig } from "../config/config";

export default fp(async (fastify) => {
  await fastify.register(fastifyEnv, {
    dotenv: true,
    schema: {
      type: "object",
      required: ["PORT", "MASTER_KEY", "DATABASE_URL"],
      properties: {
        PORT: { type: "number", default: 4000 },
        MASTER_KEY: { type: "string", minLength: 64 },
        DATABASE_URL: { type: "string" },
      },
    },
  });

  const config = buildConfig(fastify);

  fastify.decorate("appConfig", config);
});
