document.querySelector('.sign-in-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    // Get the input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Hardcoded credentials for demonstration
    const storedUsername = 'user123';
    const storedPassword = 'pass123';

    // Validation logic
    if (username === storedUsername && password === storedPassword) {
        // Store username and password in cookies
        document.cookie = `username=${username}; path=/`;
        document.cookie = `password=${password}; path=/`;

        // Optionally, you can use sessionStorage instead of cookies
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('password', password);

        // Redirect to /dashboard
        window.location.href = '/dashboard';
    } else {
        document.getElementById('error-message').textContent = 'Invalid username or password';
    }
});