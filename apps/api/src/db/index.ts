// import postgres from "postgres";
// import { drizzle } from "drizzle-orm/postgres-js";

// const connectionString = app.config.DATABASE_URL!;

// if (!connectionString) {
//   throw new Error("DATABASE_URL not set");
// }

// // Neon-friendly driver
// const client = postgres(connectionString, {
//   ssl: "require",
//   max: 1, // important for serverless
// });

// export const db = drizzle(client);

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

export function createDb(databaseUrl: string) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL not set");
  }

  const client = postgres(databaseUrl, {
    ssl: "require",
    max: 1,
  });

  return drizzle(client);
}
