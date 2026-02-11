import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";

export default fp(async (fastify) => {
  const schema = {
    type: "object",
    required: ["PORT"],
    properties: {
      PORT: {
        type: "number",
        default: 4000,
      },
    },
  };

  await fastify.register(fastifyEnv, {
    dotenv: true,
    schema,
  });
});
