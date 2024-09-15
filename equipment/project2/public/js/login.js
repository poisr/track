document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const phoneNumberField = document.getElementById('phone-number');
    const firstNameField = document.getElementById('first-name');
    const lastNameField = document.getElementById('last-name');

    // Change this to your API base URL
    const apiBaseUrl = 'https://track-9gcf.onrender.com';

    phoneNumberField.addEventListener('input', async () => {
        const phoneNumber = phoneNumberField.value;

        if (phoneNumber.length === 10) { // Assuming a valid phone number has 10 characters
            try {
                const userResponse = await fetch(`${apiBaseUrl}/auth/users/${phoneNumber}`);

                if (userResponse.ok) {
                    const user = await userResponse.json();
                    firstNameField.value = user.firstName;
                    lastNameField.value = user.lastName;
                } else if (userResponse.status === 404) {
                    firstNameField.value = '';
                    lastNameField.value = '';
                }
            } catch (error) {
                console.error('Error during verification:', error);
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
            const userResponse = await fetch(`${apiBaseUrl}/auth/users/${phoneNumber}`);

            if (userResponse.ok) {
                const user = await userResponse.json();
                localStorage.setItem('userDetails', JSON.stringify(user));
                if (user.isAdmin) {
                    window.location.href = './admin-choice.html';
                } else {
                    showWelcomeMessage(`Welcome, ${user.firstName} ${user.lastName}!`);
                }
            } else if (userResponse.status === 404) {
                const createResponse = await fetch(`${apiBaseUrl}/auth/login`, {
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
                    showWelcomeMessage(`New user created, welcome ${result.user.firstName} ${result.user.lastName}!`);
                }
            } else {
                throw new Error('Error loading user details');
            }
        } catch (error) {
            console.error('Error during login process:', error);
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
