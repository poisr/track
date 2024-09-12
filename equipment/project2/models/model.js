const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // ייבוא של חיבור ל-Sequelize
const Product = require('./product'); // ייבוא של המודל Product

// יצירת המודל Model
const Model = sequelize.define('Model', {
    name: {
        type: DataTypes.STRING,
        allowNull: true, // אם השם לא חובה
    },
    barcode: {
        type: DataTypes.STRING,
        allowNull: true, // תוכל לשנות ל-false אם הברקוד הוא חובה
        unique: true, // להבטיח שכל ברקוד הוא ייחודי
    },
    productId: {
        type: DataTypes.INTEGER, // או סוג שמתאים למזהה שלך, כמו STRING אם המזהים הם טקסט
        references: {
            model: Product, // המודל אליו מתייחסים
            key: 'id', // שם השדה במודל Product שמהווה את המפתח הזר
        },
        allowNull: true, // אם הקישור ל-product לא חובה
    },
}, {
    // אפשרויות נוספות אם יש צורך
    tableName: 'models', // שם הטבלה במסד הנתונים
    timestamps: false, // אם אין לך תאריכי יצירה ועדכון
});

// הגדרת המפתח הזר
Model.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Model;
