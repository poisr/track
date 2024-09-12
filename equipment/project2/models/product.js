const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // ייבוא של חיבור ל-Sequelize
const Category = require('./category'); // ייבוא של המודל Category

// יצירת המודל Product
const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, // חובה
    },
    categoryId: {
        type: DataTypes.INTEGER, // או סוג שמתאים למזהה שלך, כמו STRING אם המזהים הם טקסט
        references: {
            model: Category, // המודל אליו מתייחסים
            key: 'id', // שם השדה במודל Category שמהווה את המפתח הזר
        },
        allowNull: false, // חובה
    },
}, {
    // אפשרויות נוספות אם יש צורך
    tableName: 'products', // שם הטבלה במסד הנתונים
    timestamps: false, // אם אין לך תאריכי יצירה ועדכון
});

// הגדרת קשרים
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;
