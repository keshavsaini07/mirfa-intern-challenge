// import { encryptPayload, decryptPayload } from "@repo/crypto";
// import * as txRepository from "../repositories/tx.repository";

// export async function encrypt(data: any, masterKey: Buffer) {
//   const record = encryptPayload(masterKey, data.partyId, data.payload);
//   await txRepository.save(record);
//   return record;
// }

// export async function view(id: string) {
//   const record = await txRepository.findById(id);
//   if (!record) throw new Error("Transaction not found");
//   return record;
// }

// export async function decrypt(id: string, masterKey: Buffer) {
//   const record = await txRepository.findById(id);
//   if (!record) throw new Error("Transaction not found");

//   const updatedRecord = {
//     ...record,
//     createdAt: record.createdAt.toISOString(),
//   };

//   const payload = decryptPayload(masterKey, updatedRecord);
//   return payload;
// }

// type TxRepository = ReturnType<typeof txRepository.createTxRepository>;

// export default function createTxService(
//   txRepository: TxRepository,
// ) {
//   return {
//     encrypt,
//     view,
//     decrypt,
//   };
// }

import { encryptPayload, decryptPayload } from "@repo/crypto";

export default function createTxService(
  repo: ReturnType<
    typeof import("../repositories/tx.repository").createTxRepository
  >,
  masterKey: Buffer,
) {
  return {
    async encrypt(partyId: string, payload: Record<string, unknown>) {
      const encrypted = encryptPayload(masterKey, partyId, payload);

      await repo.save(encrypted);

      return encrypted;
    },

    async view(id: string) {
      const record = await repo.findById(id);
      return record;
    },

    async decrypt(id: string) {
      const record = await repo.findById(id);
      if (!record) return null;

      return decryptPayload(masterKey, record);
    },
  };
}
