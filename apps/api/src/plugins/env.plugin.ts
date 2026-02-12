import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";

// Loads env and runtime validation
export default fp(async (fastify) => {
  const schema = {
    type: "object",
    required: ["PORT", "MASTER_KEY", "DATABASE_URL"],
    properties: {
      PORT: {
        type: "number",
        default: 4000,
      },
      MASTER_KEY: {
        type: "string",
        minLength: 64,
      },
      DATABASE_URL: {
        type: "string",
      },
    },
  };

  await fastify.register(fastifyEnv, {
    dotenv: true,
    schema,
  });
});
