const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // ייבוא של חיבור ל-Sequelize
const Model = require('./model'); // ייבוא של המודל Model

// יצירת המודל Item
const Item = sequelize.define('Item', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, // חובה
    },
    barcode: {
        type: DataTypes.STRING,
        allowNull: true, // תוכל לשנות ל-false אם הברקוד הוא חובה
        unique: true, // להבטיח שכל ברקוד הוא ייחודי
    },
    modelId: {
        type: DataTypes.INTEGER, // או STRING בהתאם למודל Model
        references: {
            model: Model, // המודל אליו מתייחסים
            key: 'id', // שם השדה במודל Model שמהווה את המפתח הזר
        },
        allowNull: false, // חובה
    },
}, {
    // אפשרויות נוספות אם יש צורך
    tableName: 'items', // שם הטבלה במסד הנתונים
    timestamps: false, // אם אין לך תאריכי יצירה ועדכון
});

// הגדרת המפתח הזר
Item.belongsTo(Model, { foreignKey: 'modelId' });

module.exports = Item;
