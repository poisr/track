app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find(); // הנח שיש לך מודל Category
        res.json(categories);
    } catch (error) {
        console.error('שגיאה בטעינת קטגוריות:', error);
        res.status(500).send('שגיאה בטעינת קטגוריות');
    }
});
