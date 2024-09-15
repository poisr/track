document.addEventListener('DOMContentLoaded', () => {
    // הגדרת המשתנים
    const form = document.getElementById('login-form');
    const phoneNumberField = document.getElementById('phone-number');
    const firstNameField = document.getElementById('first-name');
    const lastNameField = document.getElementById('last-name');

    const apiBaseUrl = 'https://track-vv4f.onrender.com';

    phoneNumberField.addEventListener('input', async () => {
        const phoneNumber = phoneNumberField.value;

        if (phoneNumber.length === 10) {
            console.log('Fetching user data for phone number:', phoneNumber);
            try {
                const userResponse = await fetch(`${apiBaseUrl}/auth/users/${phoneNumber}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors' // Ensure CORS mode is set
                });

                console.log('User response status:', userResponse.status);

                if (userResponse.ok) {
                    const user = await userResponse.json();
                    firstNameField.value = user.firstName || '';
                    lastNameField.value = user.lastName || '';
                } else if (userResponse.status === 404) {
                    firstNameField.value = '';
                    lastNameField.value = '';
                } else {
                    const errorText = await userResponse.text();
                    console.error('Server response error:', errorText);
                    throw new Error(`Server error: ${errorText}`);
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

        console.log('Submitting login form for phone number:', phoneNumber);
        try {
            const userResponse = await fetch(`${apiBaseUrl}/auth/users/${phoneNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors' // Ensure CORS mode is set
            });

            console.log('User response status:', userResponse.status);

            if (userResponse.ok) {
                const user = await userResponse.json();
                localStorage.setItem('userDetails', JSON.stringify(user));
                if (user.isAdmin) {
                    window.location.href = './admin-choice.html';
                } else {
                    showWelcomeMessage(`Welcome, ${user.firstName || 'User'} ${user.lastName || ''}!`);
                }
            } else if (userResponse.status === 404) {
                const createResponse = await fetch(`${apiBaseUrl}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData),
                    mode: 'cors' // Ensure CORS mode is set
                });

                if (!createResponse.ok) {
                    const errorText = await createResponse.text();
                    console.error('Error during user creation:', errorText);
                    throw new Error(`Error creating user: ${errorText}`);
                }

                const result = await createResponse.json();
                localStorage.setItem('userDetails', JSON.stringify(result.user));
                if (result.user.isAdmin) {
                    window.location.href = './admin-choice.html';
                } else {
                    showWelcomeMessage(`New user created, welcome ${result.user.firstName || 'User'} ${result.user.lastName || ''}!`);
                }
            } else {
                const errorText = await userResponse.text();
                console.error('Error loading user details:', errorText);
                throw new Error(`Error loading user details: ${errorText}`);
            }
        } catch (error) {
            console.error('Error during login process:', error);
            alert(`An error occurred: ${error.message}`);
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





