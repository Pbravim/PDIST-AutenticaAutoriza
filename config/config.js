import dotenv from 'dotenv';
dotenv.config();


export default {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
    dialect: 'postgres',
    logging: false,
  }
};
