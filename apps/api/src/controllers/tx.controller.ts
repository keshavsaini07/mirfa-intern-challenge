import * as txService from "../services/tx.service";

export async function encrypt(req: any, reply: any) {
  const result = await txService.encrypt(req.body);
  return reply.send(result);
}