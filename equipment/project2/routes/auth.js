const express = require('express');
const router = express.Router();
const User = require('../models/user'); // ודא שהנתיב לקובץ נכון

// נתיב להתחברות
router.post('/login', async (req, res) => {
    try {
        const { phoneNumber, firstName, lastName } = req.body;

        // הדפסת הנתונים שהתקבלו בשרת
        console.log(req.body);

        // ודא שכל הנתונים הדרושים קיימים
        if (!phoneNumber) {
            return res.status(400).json({ error: 'מספר טלפון חסר' });
        }

        // קוד לבדוק את המשתמש במערכת
        let user = await User.findOne({ where: { phoneNumber } });
        if (!user) {
            // אם המשתמש לא קיים, צור משתמש חדש
            user = await User.create({ phoneNumber, firstName, lastName });
            console.log('משתמש חדש נוצר');
            return res.status(201).json({ message: 'משתמש חדש נוצר', user });
        } else {
            console.log('משתמש קיים:', user);
            return res.status(200).json({ message: 'משתמש קיים', user });
        }
    } catch (error) {
        console.error('שגיאה בכניסה:', error);
        res.status(500).json({ error: 'שגיאה פנימית בשרת' });
    }
});

// נתיב לבדוק קיום משתמש לפי מספר טלפון
router.get('/users/:phoneNumber', async (req, res) => {
    try {
        const user = await User.findOne({ where: { phoneNumber: req.params.phoneNumber } });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'משתמש לא נמצא' });
        }
    } catch (error) {
        console.error('שגיאה בבדיקת מספר טלפון:', error);
        res.status(500).json({ error: 'שגיאה פנימית בשרת' });
    }
});

module.exports = router;


