document.addEventListener('DOMContentLoaded', async () => {
    closeReport.style.display = 'none';
    exportButton.style.display = 'none';
    async function loadCategories() {
        const categoriesSelect = document.getElementById('category');
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('שגיאה בטעינת קטגוריות: ' + response.statusText);
            const categories = await response.json();
            categoriesSelect.innerHTML = '<option value="">בחר קטגוריה</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categoriesSelect.appendChild(option);
            });
        } catch (error) {
            console.error('שגיאה בטעינת קטגוריות:', error);
            alert('שגיאה בטעינת קטגוריות, בדוק את הקישור לשרת.');
        }
    }

    async function loadProducts(categoryId) {
        const productsSelect = document.getElementById('product');
        productsSelect.innerHTML = '<option value="">בחר מוצר</option>';
        try {
            const response = await fetch(`/api/products/${categoryId}`);
            if (!response.ok) throw new Error('שגיאה בטעינת מוצרים: ' + response.statusText);
            const products = await response.json();
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.name;
                productsSelect.appendChild(option);
            });
        } catch (error) {
            console.error('שגיאה בטעינת מוצרים:', error);
            alert('שגיאה בטעינת מוצרים, בדוק את הקישור לשרת.');
        }
    }

    async function loadModels(productId) {
        const modelsSelect = document.getElementById('model');
        modelsSelect.innerHTML = '<option value="">בחר דגם</option>';
        try {
            const response = await fetch(`/api/models/${productId}`);
            if (!response.ok) throw new Error('שגיאה בטעינת דגמים: ' + response.statusText);
            const models = await response.json();
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.name;
                modelsSelect.appendChild(option);
            });
        } catch (error) {
            console.error('שגיאה בטעינת דגמים:', error);
            alert('שגיאה בטעינת דגמים, בדוק את הקישור לשרת.');
        }
    }

    async function loadItems(modelId) {
        const itemsSelect = document.getElementById('item');
        itemsSelect.innerHTML = '<option value="">בחר פריט</option>';
        try {
            const response = await fetch(`/api/items/by-model/${modelId}`);
            if (!response.ok) throw new Error('שגיאה בטעינת פריטים: ' + response.statusText);
            const items = await response.json();
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name;
                itemsSelect.appendChild(option);
            });
        } catch (error) {
            console.error('שגיאה בטעינת פריטים:', error);
            alert('שגיאה בטעינת פריטים, בדוק את הקישור לשרת.');
        }
    }

    async function getCategoryName(categoryId) {
        try {
            const response = await fetch(`/api/categories/${categoryId}`);
            if (!response.ok) throw new Error('שגיאה בשליפת שם קטגוריה: ' + response.statusText);
            const category = await response.json();
            return category.name;
        } catch (error) {
            console.error('שגיאה בשליפת שם קטגוריה:', error);
            return 'לא ידוע';
        }
    }

    async function getProductName(productId) {
        try {
            const response = await fetch(`/api/products/details/${productId}`);
            if (!response.ok) throw new Error('שגיאה בשליפת שם מוצר: ' + response.statusText);
            const product = await response.json();
            return product.name;
        } catch (error) {
            console.error('שגיאה בשליפת שם מוצר:', error);
            return 'לא ידוע';
        }
    }

    async function getModelName(modelId) {
        try {
            const response = await fetch(`/api/models/details/${modelId}`);
            if (!response.ok) throw new Error('שגיאה בשליפת שם דגם: ' + response.statusText);
            const model = await response.json();
            return model.name;
        } catch (error) {
            console.error('שגיאה בשליפת שם דגם:', error);
            return 'לא ידוע';
        }
    }

    async function getItemName(itemId) {
        try {
            const response = await fetch(`/api/items/${itemId}`);
            if (!response.ok) throw new Error('שגיאה בשליפת שם פריט: ' + response.statusText);
            const item = await response.json();
            return item.name;
        } catch (error) {
            console.error('שגיאה בשליפת שם פריט:', error);
            return 'לא ידוע';
        }
    }

    document.getElementById('category').addEventListener('change', (event) => {
        const categoryId = event.target.value;
        loadProducts(categoryId);
        document.getElementById('model').innerHTML = '<option value="">בחר דגם</option>';
        document.getElementById('item').innerHTML = '<option value="">בחר פריט</option>';
    });

    document.getElementById('product').addEventListener('change', (event) => {
        const productId = event.target.value;
        loadModels(productId);
        document.getElementById('item').innerHTML = '<option value="">בחר פריט</option>';
    });

    document.getElementById('model').addEventListener('change', (event) => {
        loadItems(event.target.value);
    });

    document.getElementById('closeReport').addEventListener('click', () => {
        const reportContainer = document.getElementById('reportContainer');
        const closeReport = document.getElementById('closeReport');
        const hideElement = document.getElementById('hideElement');
        reportContainer.style.display = 'none';
        closeReport.style.display = 'none';
        hideElement.style.display = 'block';
    });

    document.getElementById('generateReport').addEventListener('click', async () => {
        const takeDate = document.getElementById('takeDate').value;
        const returnDate = document.getElementById('returnDate').value;
        const categoryId = document.getElementById('category').value;
        const productId = document.getElementById('product').value;
        const modelId = document.getElementById('model').value;
        const itemId = document.getElementById('item').value;
        const reportType = document.querySelector('input[name="reportType"]:checked').value;

        try {
            const response = await fetch(`/api/reports?takeDate=${takeDate}&returnDate=${returnDate}&categoryId=${categoryId}&productId=${productId}&modelId=${modelId}&itemId=${itemId}&reportType=${reportType}`);
            if (!response.ok) throw new Error('שגיאה בהפקת הדוח: ' + response.statusText);
            const report = await response.json();
            displayReport(report);
        } catch (error) {
            console.error('שגיאה בהפקת הדוח:', error);
            alert('שגיאה בהפקת הדוח, בדוק את הקישור לשרת.');
        }
    });
    

    async function displayReport(report) {
        const reportContainer = document.getElementById('reportContainer');
        const closeReport = document.getElementById('closeReport');
        const hideElement = document.getElementById('hideElement');
    
        hideElement.style.display = 'none';
        closeReport.style.display = 'block';
        exportButton.style.display = 'block';
        reportContainer.style.display = 'block';
    
        if (!reportContainer) {
            console.error('האלמנט reportContainer לא קיים בדף.');
            return;
        }
    
        reportContainer.innerHTML = '';
    
        if (report.length === 0) {
            reportContainer.innerHTML = '<p>לא נמצאו תוצאות עבור הדו"ח.</p>';
            return;
        }
    
        console.log('נתוני הדו"ח:', report); // הוסף לוג של הנתונים
    
        const table = document.createElement('table');
        table.style.width = '100%';
        table.setAttribute('border', '1');
        table.setAttribute('cellpadding', '5');
        table.setAttribute('cellspacing', '0');
    
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
    
        const headers = ['שם פרטי', 'שם משפחה', 'מספר טלפון', 'קטגוריה', 'מוצר', 'דגם', 'מספר פריט', 'תאריך לקיחה', 'תאריך החזרה', 'מיקום נוכחי', 'הערות', 'סטטוס'];
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
    
        const tbody = document.createElement('tbody');
        const namePromises = report.map(async log => {
            // console.log('לוג פרטי:', log); // הוסף לוג של כל לוג
    
            const categoryName = await getCategoryName(log.category);
            const productName = await getProductName(log.product);
            const modelName = await getModelName(log.model);
            const itemName = await getItemName(log.item);
    
            // קריאה ישירה מה-log במקרה שאין אובייקט user
            const firstName = log.userFirstName || 'לא זמין';
            const lastName = log.userLastName || 'לא זמין';
            const phone = log.userPhone || 'לא זמין';
    
            // console.log('פרטי המשתמש:', { firstName, lastName, phone }); // לוג של פרטי המשתמש
    
            return {
                firstName,
                lastName,
                phone,
                categoryName,
                productName,
                modelName,
                itemName,
                takeDate: log.takeDate ? new Date(log.takeDate).toLocaleString() : 'לא זמין',
                returnDate: log.returnDate ? new Date(log.returnDate).toLocaleString() : 'לא דווח',
                location: log.location || 'לא זמין',
                notes: log.notes || 'לא זמין',
                action: log.action || 'לא זמין'
            };
        });
    
        const rows = await Promise.all(namePromises);
        rows.forEach(rowData => {
            console.log('שורת נתונים:', rowData); // לוג של כל שורת נתונים
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rowData.firstName}</td>
                <td>${rowData.lastName}</td>
                <td>${rowData.phone}</td>
                <td>${rowData.categoryName}</td>
                <td>${rowData.productName}</td>
                <td>${rowData.modelName}</td>
                <td>${rowData.itemName}</td>
                <td>${rowData.takeDate}</td>
                <td>${rowData.returnDate}</td>
                <td>${rowData.location}</td>
                <td>${rowData.notes.replace(/\n/g, '<br>')}</td>
                <td>${rowData.action}</td>
            `;
            tbody.appendChild(row);
        });

        // הוספת מאזין לאירוע לחיצה על כפתור הייצוא
document.getElementById('exportButton').addEventListener('click', function() {
    // בחר את הטבלה שברצונך לייצא
    const table = document.querySelector('table');
    
    // יצירת אובייקט של ספר עם תוכן הטבלה
    const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    
    // התאם את גובה העמודות ושורות בצורה אוטומטית
    const ws = wb.Sheets['Sheet1'];
    const range = XLSX.utils.decode_range(ws['!ref']);
    
    // חישוב גובה כל עמודה
    for (let col = range.s.c; col <= range.e.c; col++) {
        const colLetter = XLSX.utils.encode_col(col);
        ws['!cols'] = ws['!cols'] || [];
        const maxLen = Math.max(...Array.from({length: range.e.r - range.s.r + 1}, (_, row) => {
            const cell = ws[colLetter + (row + 1)];
            return cell ? cell.v.toString().length : 0;
        }));
        ws['!cols'][col] = { width: maxLen + 2 }; // הוספת רווחים מסביב
    }
    
    // פונקציה להמיר את המידע למערך ביטים
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    // הורדת הקובץ
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))], { type: 'application/octet-stream' }));
    a.download = 'table_data.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

    
        table.appendChild(tbody);
        reportContainer.appendChild(table);
    }
    
    
    loadCategories();
});
