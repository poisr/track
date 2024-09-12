document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('choice-form');
    
    if (!form) {
        console.error('Form element not found');
        return;
    }

    window.submitChoice = (choice) => {
        if (choice === 'reports') {
            window.location.href = './reports.html';
        } else if (choice === 'equipment-form') {
            window.location.href = './action-selection.html';
        } else {
            console.error('Choice is invalid:', choice);
        }
    };
});
