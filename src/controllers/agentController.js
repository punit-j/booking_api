import Agent from '../models/agent.js';

// GET /agents
async function getAllAgents(req, res) {
  try {
    // Retrieve all agents (no specific agent filtering in this example)
    const agents = await Agent.findAll();

    res.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export { getAllAgents };