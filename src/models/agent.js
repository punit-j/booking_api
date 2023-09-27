import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize/sequelize.js';

const Agent = sequelize.define('Agent', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

// Create a method to get an agent's role by ID
Agent.getRoleById = async function (agentId) {
    try {
        const agent = await Agent.findByPk(agentId);
        if (!agent) {
            return null; // Agent not found
        }
        return agent.role;
    } catch (error) {
        console.error('Error fetching agent role:', error);
        throw error;
    }
};

// Define associations
Agent.associate = (models) => {
    Agent.hasMany(models.Booking, { as: 'booked_by', foreignKey: 'agentId' });
    Agent.hasMany(models.User, { as: 'users', foreignKey: 'agentId' });
}

export default Agent;