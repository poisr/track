document.addEventListener('DOMContentLoaded', async () => {
    function elementExists(id) {
        return document.getElementById(id) !== null;
    }

    const action = localStorage.getItem('action');
    const locationContainer = document.getElementById('locationContainer');
    const locationInput = document.getElementById('location');

    if (action === 'return') {
        locationContainer.style.display = 'none';
        locationInput.removeAttribute('required');
    } else {
        locationInput.value = "";
    }

    async function handleEquipmentForm() {
        const categoriesSelect = document.getElementById('category');
        const productsSelect = document.getElementById('product');
        const modelsSelect = document.getElementById('model');
        const itemsSelect = document.getElementById('item');
        // const barcodeInput = document.getElementById('barcode');
        const manualBarcodeInput = document.getElementById('manualBarcode');
        const startScanButton = document.getElementById('startScan');
        const stopScanButton = document.getElementById('stopScan');
        const containerFrom = document.getElementById('containerFrom');
        const barcodeScanner = document.getElementById('barcodeScanner');

        barcodeScanner.style.display = 'none';

        try {
            const categoriesResponse = await fetch('/api/categories');
            const categories = await categoriesResponse.json();

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categoriesSelect.appendChild(option);
            });

            categoriesSelect.addEventListener('change', async () => {
                const categoryId = categoriesSelect.value;
                productsSelect.innerHTML = '<option value="">בחר מוצר</option>';
                modelsSelect.innerHTML = '<option value="">בחר דגם</option>';

                if (categoryId) {
                    try {
                        const productsResponse = await fetch(`/api/products/${categoryId}`);
                        const products = await productsResponse.json();

                        products.forEach(product => {
                            const option = document.createElement('option');
                            option.value = product.id;
                            option.textContent = product.name;
                            productsSelect.appendChild(option);
                        });
                    } catch (error) {
                        console.error('שגיאה בטעינת מוצרים:', error);
                    }
                }
            });

            productsSelect.addEventListener('change', async () => {
                const productId = productsSelect.value;
                modelsSelect.innerHTML = '<option value="">בחר דגם</option>';

                if (productId) {
                    updateModels(productId); // קריאה לפונקציה המעדכנת את הדגמים
                }
            });

            modelsSelect.addEventListener('change', async () => {
                const modelId = modelsSelect.value;
                itemsSelect.innerHTML = '<option value="">בחר פריט</option>';

                if (modelId) {
                    try {
                        const itemsResponse = await fetch(`/api/items/by-model/${modelId}`);
                        const items = await itemsResponse.json();

                        items.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.id;
                            option.textContent = item.name;
                            itemsSelect.appendChild(option);
                        });
                    } catch (error) {
                        console.error('שגיאה בטעינת פריטים:', error);
                    }
                }
            });

            let scannerActive = false;

            function initScanner() {
                const videoContainer = document.querySelector('#barcodeScanner');
                if (videoContainer) {
                    videoContainer.style.position = 'absolute';
                    videoContainer.style.top = '0';
                    videoContainer.style.left = '0';
                    videoContainer.style.width = '100vw';  // Set to full viewport width
                    videoContainer.style.height = '100vh'; // Set to full viewport height
                    videoContainer.style.zIndex = '-1'; // Ensure it's behind other elements
                }
            
                const hasCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
            
                if (!hasCamera) {
                    Swal.fire({
                        icon: 'error',
                        title: 'שגיאה',
                        text: 'מצלמה לא נתמכת במכשיר זה.',
                    });
                    return;
                }
            
                navigator.mediaDevices.enumerateDevices()
                    .then(devices => {
                        const videoDevices = devices.filter(device => device.kind === 'videoinput');
                        const selectedDeviceId = videoDevices.length > 1 ? videoDevices[1].deviceId : videoDevices[0].deviceId;
            
                        Quagga.init({
                            inputStream: {
                                type: "LiveStream",
                                target: videoContainer,
                                constraints: {
                                    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
                                    facingMode: { ideal: 'environment' },
                                    width: { ideal: window.innerWidth },
                                    height: { ideal: window.innerHeight },
                                    focusMode: 'continuous' // מיקוד אוטומטי, אם נתמך
                                }
                            },
                            decoder: {
                                readers: [
                                    "code_128_reader",
                                    "ean_reader",
                                    "ean_8_reader",
                                    "upc_reader",
                                    "upc_e_reader"
                                ]
                            },
                            locate: true
                        }, (err) => {
                            if (err) {
                                console.error('QuaggaJS initialization error:', err);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'שגיאה',
                                    text: 'שגיאה בהפעלת סורק הברקודים. נסה שוב מאוחר יותר.',
                                });
                                return;
                            }
                            Quagga.start();
                        });
                    })
                    .catch(error => {
                        console.error('Error accessing camera:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'שגיאה',
                            text: 'שגיאה בגישה למצלמה. ודא שהרשאות המצלמה ניתנו.',
                        });
                    });
            
                Quagga.onDetected((data) => {
                    const barcode = data.codeResult.code;
                    console.log('Barcode detected:', barcode);
                    // barcodeInput.value = barcode; // Uncomment if you want to use this
                    manualBarcodeInput.value = barcode;
                    Quagga.stop();
                    scannerActive = false;
            
                    fetchProductDetails(barcode);
                });
            }
            
            // Call initScanner when the page is fully loaded
            document.addEventListener('DOMContentLoaded', initScanner);
            

            

function fetchProductDetails(barcode) {
    if (!barcode || barcode === 'undefined') {
        console.error('Barcode is invalid or undefined.');
        return;
    }

    fetch(`/api/products/by-barcode/${barcode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                const categorySelect = document.getElementById('category');
                const productSelect = document.getElementById('product');
                const modelSelect = document.getElementById('model');
                const itemSelect = document.getElementById('item');

                // Update the product and model dropdowns based on the fetched data
                categorySelect.value = data.categoryId;
                updateProducts(data.categoryId, data.id);

                containerFrom.style.display = 'block';
                barcodeScanner.style.display = 'none';

                if (data.modelId) {
                    setTimeout(() => {
                        modelSelect.value = data.modelId;
                        updateItems(data.modelId);

                        if (data.itemId) {
                            setTimeout(() => {
                                itemSelect.value = data.itemId; // Update the item if found
                            }, 500); // Wait to ensure items are loaded
                        }
                    }, 500); // Wait to ensure models are loaded
                }
            } else {
                console.error('Product or Model not found');
            }
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
        });
}

            

            function updateModels(productId) {
                modelsSelect.innerHTML = '<option value="">בחר דגם</option>';
                fetch(`/api/models/${productId}`)
                    .then(response => response.json())
                    .then(models => {
                        models.forEach(model => {
                            const option = document.createElement('option');
                            option.value = model.id;
                            option.textContent = model.name;
                            modelsSelect.appendChild(option);
                        });

                        // אם יש דגם שמצאנו לפי הברקוד
                        const selectedModel = models.find(model => model.barcode === manualBarcodeInput.value);
                        if (selectedModel) {
                            modelsSelect.value = selectedModel.id;
                            updateItems(selectedModel.id); // עדכון הפריטים לפי הדגם שנבחר
                        }
                    })
                    .catch(error => {
                        console.error('שגיאה בטעינת דגמים:', error);
                    });
            }

            function updateProducts(categoryId, selectedProductId) {
                productsSelect.innerHTML = '<option value="">בחר מוצר</option>';
                fetch(`/api/products/${categoryId}`)
                    .then(response => response.json())
                    .then(products => {
                        products.forEach(product => {
                            const option = document.createElement('option');
                            option.value = product.id;
                            option.textContent = product.name;
                            productsSelect.appendChild(option);
                        });

                        if (selectedProductId) {
                            productsSelect.value = selectedProductId;
                            updateModels(selectedProductId); // עדכון הדגמים לאחר עדכון המוצר
                        }
                    })
                    .catch(error => {
                        console.error('שגיאה בטעינת מוצרים:', error);
                    });
            }

            function updateItems(modelId) {
                itemsSelect.innerHTML = '<option value="">בחר פריט</option>';
                fetch(`/api/items/by-model/${modelId}`)
                    .then(response => response.json())
                    .then(items => {
                        items.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.id;
                            option.textContent = item.name;
                            itemsSelect.appendChild(option);
                        });
                    })
                    .catch(error => {
                        console.error('שגיאה בטעינת פריטים:', error);
                    });
            }

            const equipmentForm = document.getElementById('equipmentForm');
            if (equipmentForm) {
                equipmentForm.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
                    if (!userDetails) {
                        console.error('פרטי המשתמש לא נמצאו.');
                        Swal.fire({
                            icon: 'error',
                            title: 'שגיאה',
                            text: 'פרטי המשתמש לא נמצאו, אנא התחבר מחדש.',
                        });
                        return;
                    }

                    const equipmentData = {
                        user: {
                            firstName: userDetails.firstName,
                            lastName: userDetails.lastName,
                            phone: userDetails.phoneNumber,
                        },
                        action: action,
                        category: document.getElementById('category').value,
                        product: document.getElementById('product').value,
                        model: document.getElementById('model').value,
                        item: document.getElementById('item').value,
                        notes: document.getElementById('notes').value,
                        location: document.getElementById('location').value,
                        barcode: manualBarcodeInput.value,
                        manualBarcode: manualBarcodeInput.value,
                    };

                    try {
                        const response = await fetch('/api/equipment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(equipmentData),
                        });

                        if (!response.ok) throw new Error('Network response was not ok.');

                        Swal.fire({
                            icon: 'success',
                            title: 'המידע נשמר בהצלחה',
                            text: 'המידע נשמר בהצלחה.',
                        });

                        equipmentForm.reset();
                    } catch (error) {
                        console.error('שגיאה בשמירת המידע:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'שגיאה',
                            text: 'שגיאה בשמירת המידע, אנא נסה שוב מאוחר יותר.',
                        });
                    }
                });

                // Start barcode scanning on button click
                if (startScanButton) {
                    startScanButton.addEventListener('click', () => {
                        containerFrom.style.display = 'none';
                        barcodeScanner.style.display = 'block';
                        if (!scannerActive) {
                            initScanner();
                            scannerActive = true;
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning',
                                text: 'The scanner is already active.',
                            });
                        }
                    });
                }

                // Stop barcode scanning on button click
                if (stopScanButton) {
                    stopScanButton.addEventListener('click', () => {
                        if (scannerActive) {
                            Quagga.stop();
                            scannerActive = false;
                        }
                    });
                }
            }

            // Handle manual barcode input
            if (manualBarcodeInput) {
                manualBarcodeInput.addEventListener('change', () => {
                    const barcode = manualBarcodeInput.value;
                    if (barcode) {
                        fetchProductDetails(barcode);
                    }
                });
            }
        } catch (error) {
            console.error('שגיאה כללית:', error);
        }

        let barcodeBuffer = '';
let barcodeBufferTimeout = null;

// Function to clean the barcode (remove unwanted characters)
function cleanBarcode(barcode) {
    return barcode.replace(/[\s\r\n]+/g, ''); // Remove spaces, carriage returns, and newlines
}

// Listen for global keyboard events
document.addEventListener('keydown', (event) => {
    // If no input field for barcode, exit function
    if (!manualBarcodeInput) return;

    // Filter out the Enter key (and other unwanted keys)
    if (event.key !== 'Enter') {
        barcodeBuffer += event.key;
    }

    clearTimeout(barcodeBufferTimeout);
    barcodeBufferTimeout = setTimeout(() => {
        if (barcodeBuffer) {
            const cleanedBarcode = cleanBarcode(barcodeBuffer);
            manualBarcodeInput.value = cleanedBarcode;
            console.log('Barcode detected and input updated:', cleanedBarcode);
            fetchProductDetails(cleanedBarcode); // Call function to handle the barcode
            barcodeBuffer = ''; // Clear the buffer after processing
        }
    }, 500); // Wait 500 ms before processing the barcode
});

    }

    handleEquipmentForm();
});

