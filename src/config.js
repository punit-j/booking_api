import dotenv from "dotenv";

dotenv.config({path:'../.env'});

export const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    }
};

export const PORT = process.env.PORT;