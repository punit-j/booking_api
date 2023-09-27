import dotenv from "dotenv";

dotenv.config({path:'../.env'});

const databaseConfig = {
  development: {
    dialect: 'mssql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    dialectOptions: {
      options: {
        encrypt: true, // For secure connections (required for Azure SQL Database)
      },
    },
  },
};

export const PORT = process.env.PORT;

export default databaseConfig;
