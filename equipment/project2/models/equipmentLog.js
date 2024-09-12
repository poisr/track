// models/equipmentLog.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // ייבוא של חיבור ל-Sequelize

const EquipmentLog = sequelize.define('EquipmentLog', {
    userFirstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userLastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userPhone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    model: {
        type: DataTypes.STRING,
    },
    item: {
        type: DataTypes.STRING,
    },
    notes: {
        type: DataTypes.STRING,
    },
    takeDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    returnDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    // אפשרויות נוספות אם יש צורך
    tableName: 'equipment_logs', // שם הטבלה במסד הנתונים
    timestamps: false, // אם אין לך תאריכי יצירה ועדכון
});

module.exports = EquipmentLog;
