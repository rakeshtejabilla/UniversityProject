document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const data = {
        username: e.target.username.value,
        password: e.target.password.value
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('loggedIn', 'true');
            alert('Login successful');
            location.href = 'index.html'; // Redirect to home page
        } else {
            document.getElementById('error-message').style.display = 'block';
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target['confirm-password'].value;

    if (password !== confirmPassword) {
        document.getElementById('message').innerHTML = "Passwords do not match!";
        return;
    }

    const data = { username, password };

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerHTML = data.message;
    })
    .catch(error => console.error('Error:', error));
});

function register() {
    location.href = 'registration-form.html'; 
}