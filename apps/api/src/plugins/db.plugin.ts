import fp from "fastify-plugin";
import { createDb } from "../db";
import { createTxRepository } from "../repositories/tx.repository";
import createTxService from "../services/tx.service";

export default fp(async (fastify) => {
  const db = createDb(fastify.appConfig.databaseUrl);

  const repo = createTxRepository(db);

  const masterKey = fastify.appConfig.masterKey;

  const service = createTxService(repo, masterKey);

  fastify.decorate("txService", service);
});
