import sql from "mssql";
import Sequelize, {DataTypes} from "sequelize"
import databaseConfig from "../../config/config.mjs";

var db = {};

// Create a Sequelize instance with the database configuration
const sequelize = new Sequelize(databaseConfig.development)

// Test the database connection
async function testDatabaseConnection() {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }


// const pool = new sql.ConnectionPool(databaseConfig);
// await pool.connect();

// const getDBConnection = async () => {
//     return pool.request();
// }

// const closeDBConnection = () => {
//     pool.close();
// }

// // Function to create tables
// const createTable = async () => {
//     try {
//         const request = await getDBConnection();

//         // Define the table creation query
//         const userTableQuery = `
//         CREATE TABLE [user] (
//             id INT IDENTITY(1,1) PRIMARY KEY,
//             name NVARCHAR(255) NOT NULL,
//             email NVARCHAR(255) NOT NULL,
//             agent_id INT FOREIGN KEY REFERENCES [agent](id),
//         );`;


//         const agentTableQuery = `
//         CREATE TABLE agent (
//             id INT IDENTITY(1,1) PRIMARY KEY,
//             name NVARCHAR(255) NOT NULL,
//             email NVARCHAR(255) NOT NULL,
//             role NVARCHAR(255) NOT NULL,
//         );`;

//         const bookingTableQuery = `
//         CREATE TABLE bookings (
//             id INT IDENTITY(1,1) PRIMARY KEY,
//             user_id INT FOREIGN KEY REFERENCES [user](id),
//             agent_id INT FOREIGN KEY REFERENCES [agent](id),
//             start_at DATETIME NOT NULL,
//             finish_at DATETIME NOT NULL,
//         );`;

//         // Execute the query
//         await request.query(agentTableQuery);
//         await request.query(userTableQuery);
//         await request.query(bookingTableQuery);

//         console.log('Tables created successfully');
//     } catch (err) {
//         console.error('Error creating tables:', err);
//     } finally {
//         closeDBConnection();
//         await basicEntries()
//     }
// }

const getBookingsForWeek = async (date) => {
    try {
        const request = await getDBConnection();
        const query = `
        -- Calculate the start date of the week (Sunday) containing the provided date
        DECLARE @WeekStartDate DATE = DATEADD(DAY, -DATEPART(WEEKDAY, @UserDate) + 1, @UserDate);
        -- Calculate the end date of the week (Saturday) containing the provided date
        DECLARE @WeekEndDate DATE = DATEADD(DAY, 7 - DATEPART(WEEKDAY, @UserDate), @UserDate);
        SELECT *
        FROM bookings
        WHERE start_at >= @WeekStartDate
        AND start_at <= @WeekEndDate;`

        request.input('UserDate', sql.Date, date)

        return await request.query(query);
    }
    catch (err) {
        console.log("request not done " + err)
        throw new Error(err)
    }
    finally {
        closeDBConnection()
    }
}

const getAgentRole = async (agentId) => {
    try {
        const request = await getDBConnection()
        const query = `SELECT role 
        FROM agent WHERE id = @agentId;
        `
        request.input('agentId', sql.NVarChar, agentId)

        const agent = await request.query(query);
        return agent;
    }
    catch (err) {
        console.log('no agent found ' + err)
        throw new Error(err)
    }
    finally {
        closeDBConnection()
    }
}

// const addBooking = async (booking, agentId) => {
//     try {
//         const request = await getDBConnection()

//         const query = ` INSERT INTO bookings (user_id, agent_id, start_at, finish_at)
//         VALUES
//         (@userId, @agentId, GETDATE(), @finishDate);`

//         request.input('userId', sql.Int, booking.userId)
//         request.input('agentId', sql.Int, agentId)
//         request.input('finishDate', sql.Date, booking.finishDate)

//         await request.query(query)
//     }
//     catch (err) {
//         console.log("error in creating booking", err)
//         throw new Error(err)
//     }
//     finally {
//         closeDBConnection()
//     }
// }

// const deleteBooking = async (bookingId) => {
//     try {
//         const request = await getDBConnection();

//         // SQL query to delete the booking by ID
//         const query = `
//         DELETE FROM [bookings]
//         WHERE id = @bookingId;
//         `;

//         // Set the parameter value
//         request.input('bookingId', sql.Int, bookingId);

//         // Execute the query
//         const result = await request.query(query);

//         // Check if a booking was deleted
//         if (result.rowsAffected[0] === 0) {
//             return new Error("no booking found");
//         }
//     }
//     catch (err) {
//         console.error('Error deleting booking:', err);
//         throw new Error(err)
//     }
//     finally {
//         closeDBConnection()
//     }
// }

// const getUsers = async (agentId) => {
//     try {
//         const request = await getDBConnection()

//         const query = `
//         SELECT * FROM [user]
//         WHERE agent_id = @agentId;`;

//         request.input('agentId', sql.Int, agentId);

//         const agents = await request.query(query);
//         return agents;
//     }
//     catch (err) {
//         console.log("error fetching users "+ err)
//         throw new Error(err)
//     }
//     finally{
//         closeDBConnection()
//     }
// }

// const getAgents = async () => {
//     try {
//         const request = await getDBConnection()

//         const query = `
//         SELECT * FROM [agent];`;

//         const agents = await request.query(query);
//         return agents;
//     }
//     catch (err) {
//         console.log("error fetching agents "+ err)
//         throw new Error(err)
//     }
//     finally{
//         closeDBConnection()
//     }
// }

const model = () => {
    const agentAttributes = {
        // id: { type: DataTypes.INTEGER, allowNull: false},
        name: {type: DataTypes.STRING, allownull: false},
        email: { type: DataTypes.STRING, allowNull: false},
        role: {type: DataTypes.STRING, allowNull: false}
    }

    const userAttributes = {
        // id: { type: DataTypes.INTEGER, allowNull: false},
        name: {type: DataTypes.STRING, allownull: false},
        email: { type: DataTypes.STRING, allowNull: false},
    }
    
    const bookingAttributes = {
        // id: { type: DataTypes.INTEGER, allowNull: false},
        start_at: {type: DataTypes.DATE, allownull: false},
        finish_at: { type: DataTypes.DATE, allowNull: false},
    }

    var agent = sequelize.define('Agent', agentAttributes);
    var user = sequelize.define('User', userAttributes);
    var booking = sequelize.define('Booking', bookingAttributes);

    user.hasMany(booking,  {foreignKey: "user_id"})
    agent.hasMany(booking, {foreignKey: "agent_id"})
    agent.hasMany(user,  {foreignKey: "agent_id"})
    booking.belongsTo(user,  {foreignKey: "user_id"})
    booking.belongsTo(agent,  {foreignKey: "agent_id"})

    user.findByAgent = async (id) => {
        return await user.findOne({where: {agent_id: id}}) 
    }

    agent.findAll = async () => {
        return await agent.findAll()
    }

    booking.deleteBooking = async (id) => {
        return await booking.destroy({where: {booking_id: id}})
    }

    booking.addBooking = async (userId, agentId, finishDate) => {
        return booking.create({user_id: userId, agent_id: agentId, start_at: DataTypes.NOW, finish_at: finishDate})
    }

    

}

const basicEntries = async () => {
    try {
        const request = await getDBConnection()
        const addUser = `
        DECLARE @agent1Id INT, @agent2Id INT, @agent3Id INT;
        SELECT @agent1Id = id FROM agent WHERE name = 'Agent 1';
        SELECT @agent2Id = id FROM agent WHERE name = 'Agent 2';
        SELECT @agent3Id = id FROM agent WHERE name = 'Agent 3';
        INSERT INTO [user] (name, email, agent_id)
        VALUES
        ('User 1', 'user1@example.com', @agent1Id),
        ('User 2', 'user2@example.com', @agent2Id),
        ('User 3', 'user3@example.com', @agent3Id);`

        const addAgent = `
        INSERT INTO agent (name, email, role)
        VALUES
        ('Agent 1', 'agent1@example.com', 'admin'),
        ('Agent 2', 'agent2@example.com', 'admin'),
        ('Agent 3', 'agent3@example.com', 'regular');`

        const addBooking = `
        DECLARE @user1Id INT, @user2Id INT, @agent1Id INT, @agent2Id INT;
        SELECT @user1Id = id FROM [user] WHERE name = 'User 1';
        SELECT @user2Id = id FROM [user] WHERE name = 'User 2';
        SELECT @agent1Id = id FROM agent WHERE name = 'Agent 1';
        SELECT @agent2Id = id FROM agent WHERE name = 'Agent 2';

        INSERT INTO bookings (user_id, agent_id, start_at, finish_at)
        VALUES
        (@user1Id, @agent1Id, '2023-09-01T10:00:00', '2023-09-02T10:00:00'),
        (@user2Id, @agent2Id, '2023-09-07T14:30:00', '2023-09-08T14:30:00'),
        (@user1Id, @agent1Id, '2023-09-14T09:15:00', '2023-09-15T09:15:00');`

        await request.query(addAgent);
        await request.query(addUser);
        await request.query(addBooking);
        console.log("Dummy values added successfully")
    }
    catch (err) {
        console.log("error occoured" + err);
    }
    finally {
        closeDBConnection();
    }
}

export { sequelize, testDatabaseConnection };