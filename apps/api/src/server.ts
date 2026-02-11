import { buildApp } from "./app";

const start = async () => {
  const app = buildApp();

  try {
    await app.ready();
    
    const port = app.config.PORT;

    await app.listen({ port });
    console.log(`Server running on port: `, port);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
