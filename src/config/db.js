import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = String(
  process.env.DATABASE_URL ||
  process.env.MYSQL_PUBLIC_URL ||
  ''
).trim();

let db;

if (databaseUrl) {
  db = new Sequelize(databaseUrl, {
    dialect: 'mysql',
    logging: false,
    dialectOptions:
      process.env.DB_SSL === 'true'
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          }
        : {},
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      dialect: 'mysql',
      logging: false
    }
  );
}

export default db;