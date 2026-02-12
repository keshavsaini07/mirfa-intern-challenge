import { FastifyReply, FastifyRequest } from "fastify";
import { EncryptBodyType, ViewParams } from "../utils/types";

export async function encrypt(
  req: FastifyRequest<{ Body: EncryptBodyType }>,
  reply: FastifyReply,
) {
  const { partyId, payload } = req.body;
  const result = await req.server.txService.encrypt(partyId, payload);
  return reply.send(result);
}

export async function view(
  req: FastifyRequest<{ Params: ViewParams }>,
  reply: FastifyReply,
) {
  const result = await req.server.txService.view(req.params.id);
  return reply.send(result);
}

export async function decrypt(
  req: FastifyRequest<{ Params: ViewParams }>,
  reply: FastifyReply,
) {
  const result = await req.server.txService.decrypt(req.params.id);
  return reply.send(result);
}
