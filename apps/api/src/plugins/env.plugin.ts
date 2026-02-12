import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";

// Loads env and runtime validation
export default fp(async (fastify) => {
  const schema = {
    type: "object",
    required: ["PORT", "MASTER_KEY"],
    properties: {
      PORT: {
        type: "number",
        default: 4000,
      },
      MASTER_KEY: {
        type: "string",
        minLength: 64,
      },
    },
  };

  await fastify.register(fastifyEnv, {
    dotenv: true,
    schema,
  });
});
