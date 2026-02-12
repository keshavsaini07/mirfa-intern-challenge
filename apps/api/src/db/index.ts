import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

export function createDb(databaseUrl: string) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL not set");
  }

  const client = postgres(databaseUrl, {
    ssl: "require",
    max: 1,
  });

  return drizzle(client, { schema });
}
