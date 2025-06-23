import "reflect-metadata";
import { createConnection } from "typeorm";
import config from "./infrastructure/config/default";
import server from "./infrastructure/web/server";

async function bootstrap() {
  try {
    await createConnection({
      type: "postgres",
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.database,
      synchronize: config.db.synchronize,
      entities: config.db.entities,
      migrations: config.db.migrations,
    });
    await server.listen(config.app.port);
    console.log(`Servidor corriendo en el puerto ${config.app.port} :)`);
  } catch (error) {
    console.error(error);
    console.log();
    process.exit(1);
  }
}

bootstrap();
