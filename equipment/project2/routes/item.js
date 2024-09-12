const express = require('express');
const router = express.Router();
const Item = require('../models/item'); // עדכון לשם החדש

// נתיב להחזרת פריטים לפי מזהה דגם
router.get('/:modelId', async (req, res) => {
    try {
        const items = await Item.findAll({ where: { modelId: req.params.modelId } });
        res.json(items);
    } catch (error) {
        console.error('שגיאה בשליפת פריטים:', error);
        res.status(500).send('שגיאה בשליפת פריטים');
    }
});

module.exports = router;
