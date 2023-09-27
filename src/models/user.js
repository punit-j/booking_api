import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize/sequelize.js';

const User = sequelize.define('User', {
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

// Define associations
User.associate = (models) => {
    User.hasMany(models.Booking, { as: 'bookings', foreignKey: 'userId' });
}

export default User;