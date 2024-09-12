const User = require('../models/user');

// GET /auth/users/:phoneNumber
exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ where: { phoneNumber: req.params.phoneNumber } });
        if (user) {
            res.status(200).json(user); // הוספת סטטוס 200 לאישור שהמשתמש נמצא
        } else {
            res.status(404).json({ error: 'User not found' }); // שלח JSON עם הודעת שגיאה
        }
    } catch (error) {
        console.error('Error fetching user:', error); // הדפס שגיאה ל-Console
        res.status(500).json({ error: 'Internal Server Error' }); // שלח JSON עם הודעת שגיאה
    }
};

// POST /auth/login
exports.createUser = async (req, res) => {
    try {
        const { phoneNumber, firstName, lastName } = req.body;

        // ודא שכל הנתונים הדרושים קיימים
        if (!phoneNumber || !firstName || !lastName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let user = await User.findOne({ where: { phoneNumber } });
        if (!user) {
            user = await User.create({ phoneNumber, firstName, lastName });
            res.status(201).json({ message: 'User created', user }); // סטטוס 201 ליצירת משתמש חדש
        } else {
            res.status(200).json({ message: 'User already exists', user }); // סטטוס 200 למשתמש קיים
        }
    } catch (error) {
        console.error('Error creating user:', error); // הדפס שגיאה ל-Console
        res.status(500).json({ error: 'Internal Server Error' }); // שלח JSON עם הודעת שגיאה
    }
};
