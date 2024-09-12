const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // החלף למיקום הנכון של המודל

// שליפת מוצר לפי ID
router.get('/details/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).send('מוצר לא נמצא');
        }
        res.json(product);
    } catch (error) {
        console.error('שגיאה בשליפת מוצר:', error);
        res.status(500).send('שגיאה בשרת');
    }
});

module.exports = router;
