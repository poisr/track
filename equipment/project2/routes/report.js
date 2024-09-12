const express = require('express');
const router = express.Router();
const Model = require('../models/model'); // הנח שהמודל מוגדר בקובץ models/model.js

// נתיב לקבלת פרטי דגם לפי ID
router.get('/details/:modelId', async (req, res) => {
    const modelId = req.params.modelId; // קבל את המזהה
    console.log('Fetching model with ID:', modelId); // רישום המזהה

    try {
        const model = await Model.findByPk(modelId); // השתמש ב-findByPk במקום findById
        if (!model) {
            console.log('Model not found for ID:', modelId); // רישום במקרה של דגם לא נמצא
            return res.status(404).json({ message: 'דגם לא נמצא' });
        }
        res.json(model);
    } catch (error) {
        console.error('Error fetching model:', error); // רישום השגיאה
        return res.status(500).json({ message: 'שגיאה בשליפת דגם' });
    }
});

module.exports = router;
