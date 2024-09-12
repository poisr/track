const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // ייבוא של חיבור ל-Sequelize

// יצירת המודל User
const User = sequelize.define('User', {
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false, // חובה
        unique: true, // ייחודי
        validate: {
            isNumeric: true, // לוודא שמספר הטלפון מכיל רק מספרים
            len: [10, 15] // הגבלת אורך, בהתאם לצורך
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false, // חובה
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false, // חובה
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // ברירת מחדל
    }
}, {
    // אפשרויות נוספות אם יש צורך
    tableName: 'users', // שם הטבלה במסד הנתונים
    timestamps: true, // שמור תאריכי יצירה ועדכון
    createdAt: 'created_at', // אפשר לשנות את השמות אם יש צורך
    updatedAt: 'updated_at',
});

module.exports = User;
