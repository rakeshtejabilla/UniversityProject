// document.getElementById('registration-form').addEventListener('submit', function(e) {
//     e.preventDefault();

//     const username = e.target.username.value;
//     const password = e.target.password.value;
//     const confirmPassword = e.target['confirm-password'].value;

//     if (password !== confirmPassword) {
//         document.getElementById('message').innerHTML = "Passwords do not match!";
//         return;
//     }

//     const data = { username, password };

//     fetch('/register', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then(data => {
//             localStorage.setItem('loggedIn', 'true');
//             alert(data.message);
//             location.href = 'index.html'; // Redirect to home page
    
//     })
//     .catch(error => console.error('Error:', error));
// });