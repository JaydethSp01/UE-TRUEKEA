// src/index.ts
import "reflect-metadata";
import { createConnection } from "typeorm";
import config from "./infrastructure/config/default";
import server from "./infrastructure/web/server";
import CarbonFootprintHelper from "./infrastructure/web/utils/CarbonFootprintHelper";

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
    console.log("🔌 Conexión a PostgreSQL establecida");

    console.log("♻️  Cargando datos de CO₂...");
    await CarbonFootprintHelper.loadDataFromDB();
    console.log("✅ Datos de CO₂ cargados exitosamente");

    await server.listen(config.app.port, "0.0.0.0");
    console.log(
      `🚀 Servidor corriendo en el puerto ${config.app.port} y escuchando en 0.0.0.0`
    );
  } catch (error) {
    console.error("❌ Error al inicializar la aplicación:", error);
    process.exit(1);
  }
}

bootstrap();
