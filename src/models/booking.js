import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize/sequelize.js';

const Booking = sequelize.define('Booking', {
    start_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    finish_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

// Define associations
Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: 'userId' });
    Booking.belongsTo(models.Agent, { foreignKey: 'agentId' });
}

export default Booking;