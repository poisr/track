const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize'); // ייבוא Op
const Sequelize = require('sequelize');
const authRoutes = require('./routes/auth');
const Category = require('./models/category');
const EquipmentLog = require('./models/equipmentLog');
const Product = require('./models/product');
const Model = require('./models/model');
const Item = require('./models/items');
const User = require('./models/user');
const sequelize = require('./config/sequelize');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: ['https://track-vv4f.onrender.com', 'http://localhost:8082'], // אפשר בקשות משני הדומיינים
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


const PORT = process.env.PORT || 8082;
const HOST = '0.0.0.0';

//alert("in app");

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth', authRoutes);



// Route to get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});



// Route to get a category by ID
app.get('/api/categories/:categoryId', async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error });
    }
});


// Route to get products by category ID
app.get('/api/products/:categoryId', async (req, res) => {
    try {
        const products = await Product.findAll({ where: { categoryId: req.params.categoryId } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

// Route to get a product by ID
app.get('/api/products/details/:productId', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

// Route to get models by product ID
app.get('/api/models/:productId', async (req, res) => {
    try {
        const models = await Model.findAll({
            where: { productId: req.params.productId }
        });
        res.json(models);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching models', error });
    }
});

// Route to get a model by ID
app.get('/api/models/details/:modelId', async (req, res) => {
    try {
        const model = await Model.findByPk(req.params.modelId);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        res.json(model);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching model', error });
    }
});

// Route to get all models
app.get('/api/models', async (req, res) => {
    try {
        const models = await Model.findAll();
        res.json(models);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching models', error });
    }
});

// Route to get items by model ID
app.get('/api/items/by-model/:modelId', async (req, res) => {
    try {
        const items = await Item.findAll({
            where: { modelId: req.params.modelId }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error });
    }
});

// Route to get an item by ID
app.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to get product by barcode
app.get('/api/products/by-barcode/:barcode', async (req, res) => {
    const barcode = req.params.barcode;
    try {
        // חיפוש ברקוד בטבלת ה-items
        let item = await Item.findOne({ where: { barcode } });
        
        if (item) {
            const model = await Model.findByPk(item.modelId);
            if (model) {
                const product = await Product.findByPk(model.productId);
                return res.json({
                    id: product ? product.id : null,
                    name: product ? product.name : null,
                    categoryId: product ? product.categoryId : null,
                    modelId: model ? model.id : null,
                    itemId: item.id,
                    barcode: item.barcode,
                });
            }
        }

        // חיפוש ברקוד בטבלת ה-models
        const model = await Model.findOne({ where: { barcode } });
        
        if (model) {
            const product = await Product.findByPk(model.productId);
            return res.json({
                id: product ? product.id : null,
                name: product ? product.name : null,
                categoryId: product ? product.categoryId : null,
                modelId: model ? model.id : null,
                itemId: null, // No item found
                barcode: model.barcode,
            });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// Route to save equipment log
app.post('/api/equipment', async (req, res) => {
    const { user, action, category, product, model, date, location, item, notes } = req.body;

    if (!user || !user.firstName || !user.lastName || !user.phone || !action || !category || !product || !model ) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        if (action === 'take') {
            const log = await EquipmentLog.create({
                userFirstName: user.firstName,
                userLastName: user.lastName,
                userPhone: user.phone,
                action,
                category,
                product,
                model,
                date,
                location: location || 'מחסן',
                item,
                notes: `הערות בלקיחה: ${notes}  `,
                takeDate: new Date(),
                returnDate: null
            });
            return res.status(201).json(log);
        } else if (action === 'return') {
            const previousLog = await EquipmentLog.findOne({
                where: {
                    userPhone: user.phone,
                    action: 'take',
                    product: product,
                    model: model,
                    item: item,
                    returnDate: null
                },
                order: [['takeDate', 'DESC']]
            });

            if (previousLog) {
                previousLog.returnDate = new Date();
                previousLog.action = "return";
                previousLog.location = "מחסן"
                previousLog.notes = `${previousLog.notes}\n\nהערות בהחזרה: ${notes}`; // הוספת הערות להחזרה
                await previousLog.save();
                return res.status(200).json(previousLog);
            } else {
                return res.status(400).json({ message: 'No active take record found for this user and product.' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error saving data', error });
    }
});

// Route to save user details
app.post('/api/users', async (req, res) => {
    const { firstName, lastName, phone } = req.body;

    try {
        let user = await User.findOne({ where: { phoneNumber: phone } });

        if (user) {
            user.firstName = firstName;
            user.lastName = lastName;
        } else {
            user = await User.create({ phoneNumber: phone, firstName, lastName });
        }

        await user.save();
        res.status(200).json({ message: 'User details saved successfully', user });
    } catch (error) {
        console.error('Error saving user details:', error);
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Route to generate reports
app.get('/api/reports', async (req, res) => {
    const { takeDate, returnDate, categoryId, productId, modelId, itemId, reportType } = req.query;

    try {
        let query = {};

        if (takeDate) {
            query.takeDate = { [Op.gte]: new Date(takeDate) };
        }
        if (returnDate) {
            query.returnDate = { [Op.lte]: new Date(returnDate) };
        }
        if (categoryId) {
            query.category = categoryId;
        }
        if (productId) {
            query.product = productId;
        }
        if (modelId) {
            query.model = modelId;
        }
        if (itemId) {
            query.item = itemId;
        }

        console.log('Item ID:', itemId);
        console.log('Query:', query);

        let logs;

if (reportType === 'realtime') {
    logs = await EquipmentLog.findAll({
        where: query,
        order: [[sequelize.fn('MAX', sequelize.col('id')), 'DESC']],
        group: ['item'],
        attributes: [
            'item',
            'userFirstName',
            'userLastName',
            'userPhone',
            'category',
            'product',
            'model',
            'takeDate',
            'returnDate',
            'location',
            'notes',
            'action',
            [sequelize.fn('MAX', sequelize.col('id')), 'id']
        ]
    });
} else if (reportType === 'take') {
    // Find the latest action for each item
    const latestActions = await EquipmentLog.findAll({
        order: [[sequelize.fn('MAX', sequelize.col('id')), 'DESC']],
        group: ['item'],
        attributes: [
            'item',
            'action',
            [sequelize.fn('MAX', sequelize.col('id')), 'id']
        ],
    });

    // Filter out items where the latest action is 'return'
    const itemsToExclude = latestActions
        .filter(log => log.action === 'return')
        .map(log => log.item);

    // Fetch the latest 'take' action for items not excluded
    logs = await EquipmentLog.findAll({
        where: {
            ...query,
            action: 'take',
            item: {
                [Sequelize.Op.notIn]: itemsToExclude
            }
        },
        order: [[sequelize.fn('MAX', sequelize.col('id')), 'DESC']],
        group: ['item'],
        attributes: [
            'item',
            'userFirstName',
            'userLastName',
            'userPhone',
            'category',
            'product',
            'model',
            'takeDate',
            'returnDate',
            'location',
            'notes',
            'action',
            [sequelize.fn('MAX', sequelize.col('id')), 'id']
        ]
    });
} else {
    logs = await EquipmentLog.findAll({ where: query });
}


        res.json(logs);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Error fetching reports', error });
    }
});




(async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('Database & tables created!');
        
        app.listen(PORT, HOST, () => {
            console.log(`Server is running on http://${HOST}:${PORT}`);
        });
    } catch (err) {
        console.error('Unable to sync database:', err);
    }
})();
