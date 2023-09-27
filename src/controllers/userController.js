// Import necessary modules and models
import User from '../models/user.js';

// GET /users
async function getAllUsers(req, res) {
  try {
    // get agent id
    const agentId = req.headers['x-agent-id'];

    // Query users that belong to the agent
    const users = await User.findAll({ where: { agentId } });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export { getAllUsers };

