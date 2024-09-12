document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const phoneNumberField = document.getElementById('phone-number');
    const firstNameField = document.getElementById('first-name');
    const lastNameField = document.getElementById('last-name');

    phoneNumberField.addEventListener('input', async () => {
        const phoneNumber = phoneNumberField.value;

        if (phoneNumber.length === 10) { // נניח שאורך מספר טלפון תקין הוא 10 תווים
            try {
                const userResponse = await fetch(`http://localhost:3001/auth/users/${phoneNumber}`);

                if (userResponse.ok) {
                    const user = await userResponse.json();
                    firstNameField.value = user.firstName;
                    lastNameField.value = user.lastName;
                } else if (userResponse.status === 404) {
                    firstNameField.value = '';
                    lastNameField.value = '';
                }
            } catch (error) {
                console.error('שגיאה במהלך הבדיקה:', error);
            }
        } else {
            firstNameField.value = '';
            lastNameField.value = '';
        }
    });
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const phoneNumber = phoneNumberField.value;
        const userData = {
            phoneNumber,
            firstName: firstNameField.value,
            lastName: lastNameField.value
        };

        try {
            const userResponse = await fetch(`http://localhost:3001/auth/users/${phoneNumber}`);

            if (userResponse.ok) {
                const user = await userResponse.json();
                localStorage.setItem('userDetails', JSON.stringify(user));
                if (user.isAdmin) {
                    window.location.href = './admin-choice.html';
                } else {
                    showWelcomeMessage(`ברוך הבא, ${user.firstName} ${user.lastName}!`);
                }
            } else if (userResponse.status === 404) {
                const createResponse = await fetch('http://localhost:3001/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const result = await createResponse.json();
                localStorage.setItem('userDetails', JSON.stringify(result.user));
                if (result.user.isAdmin) {
                    window.location.href = './admin-choice.html';
                } else {
                    showWelcomeMessage(`משתמש חדש נוצר, ברוך הבא ${result.user.firstName} ${result.user.lastName}!`);
                }
            } else {
                throw new Error('שגיאה בטעינת פרטי המשתמש');
            }
        } catch (error) {
            console.error('שגיאה במהלך תהליך הכניסה:', error);
            alert(error.message);
        }
    });

    function showWelcomeMessage(message) {
        const modalMessage = document.getElementById('modal-message');
        const welcomeModal = document.getElementById('welcome-modal');

        modalMessage.textContent = message;
        welcomeModal.style.display = 'block';

        setTimeout(() => {
            welcomeModal.style.display = 'none';
            const userDetails = JSON.parse(localStorage.getItem('userDetails'));
            if (!userDetails.isAdmin) {
                window.location.href = './action-selection.html';
            }
        }, 2000);
    }
});
