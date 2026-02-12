import { encryptPayload, decryptPayload } from "@repo/crypto";
import * as txRepository from "../repositories/tx.repository";
export async function encrypt(data: any, masterKey: Buffer) {
  const record = encryptPayload(data.partyId, data.payload);
  await txRepository.save(record);
  return record;
}

export async function view(id: string) {
  const record = await txRepository.findById(id);
  if (!record) throw new Error("Transaction not found");
  return record;
}

export async function decrypt(id: string) {
  const record = await txRepository.findById(id);
  if (!record) throw new Error("Transaction not found");

  const payload = decryptPayload(record);
  return payload;
}
