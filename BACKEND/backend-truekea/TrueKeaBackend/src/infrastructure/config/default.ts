import dotenv from "dotenv";
dotenv.config();

export default {
  app: {
    port: Number(process.env.PORT) || 3000,
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "truekea",
    synchronize: true,
    entities: [__dirname + "/../adapter/typeorm/entities/*Entity.{ts,js}"],
    migrations: [__dirname + "/../adapter/typeorm/migrations/*.{ts,js}"],
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your_refresh_secret",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  azure: {
    connectionString: process.env.AZURE_CONNECTION_STRING || "secret",
    containerName: process.env.AZURE_CONTAINER_NAME || "img-truekea1",
  },
};
