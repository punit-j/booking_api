import sql from "mssql";
import { dbConfig } from "../config.js";

const pool = new sql.ConnectionPool(dbConfig);

// Function to create tables
async function createTable() {
    try {
        await pool.connect();
        const request = pool.request();

        // Define the table creation query
        const userTableQuery = `
        CREATE TABLE [user] (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(255) NOT NULL,
          email NVARCHAR(255) NOT NULL,
        agent_id INT FOREIGN KEY REFERENCES [agent](id),
        );
      `;


        const agentTableQuery =
            `CREATE TABLE agent (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) NOT NULL,
       );
    `;

        const bookingTableQuery =
            `CREATE TABLE bookings (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT FOREIGN KEY REFERENCES [user](id),
        agent_id INT FOREIGN KEY REFERENCES [agent](id),
        start_at DATETIME NOT NULL,
        finish_at DATETIME NOT NULL,
      );
    `;

        // Execute the query
        await request.query(agentTableQuery);
        await request.query(userTableQuery);
        await request.query(bookingTableQuery);

        console.log('Tables created successfully');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        pool.close();
    }
}

export { pool, createTable };