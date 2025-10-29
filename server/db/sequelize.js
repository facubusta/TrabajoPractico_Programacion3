import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const DB_PATH = process.env.DB_PATH || "database.sqlite";

// logging: false para no llenar de logs de la bdd la consola
export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_PATH,
  logging: false,
});
