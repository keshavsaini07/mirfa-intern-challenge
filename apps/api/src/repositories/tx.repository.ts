import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";
import { transactions } from "../db/schema";

import type { TxnSecureRecordType } from "@repo/crypto";

export function createTxRepository(db: PostgresJsDatabase<typeof schema>) {
  return {
    async save(record: TxnSecureRecordType): Promise<TxnSecureRecordType> {
      const [row] = await db
        .insert(transactions)
        .values({
          ...record,
          createdAt: new Date(record.createdAt),
        })
        .returning();

      return {
        ...row,
        createdAt: row.createdAt.toISOString(),
      };
    },

    async findById(id: string): Promise<TxnSecureRecordType | null> {
      const row = await db.query.transactions.findFirst({
        where: (t, { eq }) => eq(t.id, id),
      });

      if (!row) return null;

      return {
        ...row,
        createdAt: row.createdAt.toISOString(),
      };
    },

    async findByPartyId(partyId: string): Promise<TxnSecureRecordType[]> {
      const rows = await db.query.transactions.findMany({
        where: (t, { eq }) => eq(t.partyId, partyId),
      });

      return rows.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
      }));
    },
  };
}

/* Without DB, basic store using map */
// const store = new Map();

// export async function save(record: any) {
//   store.set(record.id, record);
//   return record;
// }

// export async function findById(id: string) {
//   return store.get(id);
// }
