// models/category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // ייבוא של חיבור ל-Sequelize

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    // אפשרויות נוספות אם יש צורך
    tableName: 'categories', // שם הטבלה במסד הנתונים
    timestamps: false, // אם אין לך תאריכי יצירה ועדכון
});

module.exports = Category;
