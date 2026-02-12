import { pgTable, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey(),

  partyId: text("party_id").notNull(),
  createdAt: timestamp("created_at").notNull(),

  payloadNonce: text("payload_nonce").notNull(),
  payloadCiphertext: text("payload_ct").notNull(),
  payloadTag: text("payload_tag").notNull(),

  dekWrapNonce: text("dek_wrap_nonce").notNull(),
  dekWrapped: text("dek_wrapped").notNull(),
  dekWrapTag: text("dek_wrap_tag").notNull(),

  alg: text("alg").notNull(),
  mkVersion: integer("mk_version").notNull(),
});
