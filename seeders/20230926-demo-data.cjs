const { User, Agent, Booking } = require('../src/models'); // Adjust the import path as needed

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create demo agents
    const agents = await Agent.bulkCreate([
      { name: 'Agent 1', email: 'agent1@example.com' },
      { name: 'Agent 2', email: 'agent2@example.com' },
    ]);

    // Create demo users
    const users = await User.bulkCreate([
      { name: 'User 1', email: 'user1@example.com', agentId: agents[0].id },
      { name: 'User 2', email: 'user2@example.com', agentId: agents[1].id },
    ]);

    // Create demo bookings
    await Booking.bulkCreate([
      {
        start_at: new Date('2023-09-27T09:00:00Z'),
        finish_at: new Date('2023-09-27T11:00:00Z'),
        userId: users[0].id,
        agentId: agents[0].id,
      },
      {
        start_at: new Date('2023-09-28T14:00:00Z'),
        finish_at: new Date('2023-09-28T16:00:00Z'),
        userId: users[1].id,
        agentId: agents[1].id,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the demo data if needed (e.g., for rollback)
    await Booking.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Agent.destroy({ where: {} });
  },
};

