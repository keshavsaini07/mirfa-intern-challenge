import { buildApp } from "./app";

const start = async () => {
  const app = buildApp();

  try {
    await app.ready();

    const port = process.env.PORT ? Number(process.env.PORT) : 3001;

    await app.listen({
      port,
      host: "0.0.0.0",
    });

    console.log(`Server running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

// import { buildApp } from "./app";

// const app = buildApp();

// export default async function handler(req: any, res: any) {
//   await app.ready();
//   app.server.emit("request", req, res);
// }
