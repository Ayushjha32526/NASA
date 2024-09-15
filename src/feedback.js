document.getElementById('feedbackForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    let isValid = true;

    // Get form fields
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const feedback = document.getElementById('feedback').value.trim();

    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const feedbackError = document.getElementById('feedbackError');
    const successMessage = document.getElementById('successMessage');

    // Reset error messages
    nameError.style.display = 'none';
    emailError.style.display = 'none';
    feedbackError.style.display = 'none';
    successMessage.style.display = 'none';

    // Validate Name
    if (name === '') {
        nameError.textContent = 'Please enter your name.';
        nameError.style.display = 'block';
        isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        emailError.textContent = 'Please enter your email.';
        emailError.style.display = 'block';
        isValid = false;
    } else if (!emailPattern.test(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.style.display = 'block';
        isValid = false;
    }

    // Validate Feedback
    if (feedback === '') {
        feedbackError.textContent = 'Please enter your feedback.';
        feedbackError.style.display = 'block';
        isValid = false;
    }

    // Show success message if valid
    if (isValid) {
        successMessage.textContent = 'Thank you for your feedback!';
        successMessage.style.display = 'block';

        // Optionally, reset the form fields
        document.getElementById('feedbackForm').reset();
    }
});
