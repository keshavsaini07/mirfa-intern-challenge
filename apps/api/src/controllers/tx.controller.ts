import { FastifyReply, FastifyRequest } from "fastify";
import * as txService from "../services/tx.service";
import { ViewParams } from "../utils/types";

export async function encrypt(req: FastifyRequest, reply: FastifyReply) {
  const masterKey = req.server.appConfig.masterKey;
  const result = await txService.encrypt(req.body, masterKey);
  return reply.send(result);
}

export async function view(
  req: FastifyRequest<{ Params: ViewParams }>,
  reply: FastifyReply,
) {
  const result = await txService.view(req.params.id);
  return reply.send(result);
}

export async function decrypt(
  req: FastifyRequest<{ Params: ViewParams }>,
  reply: FastifyReply,
) {
  const masterKey = req.server.appConfig.masterKey;
  const result = await txService.decrypt(req.params.id, masterKey);
  return reply.send(result);
}
