import { FastifyInstance } from "fastify";

export type AppConfig = {
  masterKey: Buffer;
  port: number;
};

export function buildConfig(fastify: FastifyInstance): AppConfig {
  const masterKey = Buffer.from(
    fastify.config.MASTER_KEY,
    "hex"
  );

  if (masterKey.length !== 32) {
    throw new Error("MASTER_KEY must be 32 bytes");
  }

  return {
    masterKey,
    port: fastify.config.PORT
  };
}
