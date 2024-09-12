const express = require('express');
const router = express.Router();
const Model = require('../models/model'); // הנחת שיש מודל בשם Model

// נתיב להחזרת דגמים לפי מזהה מוצר
router.get('/:productId', async (req, res) => {
    try {
        const models = await Model.findAll({ where: { productId: req.params.productId } });
        res.json(models);
    } catch (error) {
        console.error('שגיאה בשליפת דגמים:', error);
        res.status(500).send('שגיאה בשליפת דגמים');
    }
});

module.exports = router;
