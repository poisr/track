const express = require('express');
const router = express.Router();
const Category = require('../models/category'); // החלף למיקום הנכון של המודל

// שליפת קטגוריה לפי ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id); // שימוש ב-findByPk
        if (!category) {
            return res.status(404).send('קטגוריה לא נמצאה');
        }
        res.json(category);
    } catch (error) {
        console.error('שגיאה בשרת:', error);
        res.status(500).send('שגיאה בשרת');
    }
});

module.exports = router;
