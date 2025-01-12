
document.getElementById('logout').addEventListener('click', () => {
    localStorage.clear();
    alert('Logout successful');
    location.href = 'index.html'
})

document.getElementById('add-fee-btn').addEventListener('click', function () {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
        location.href = 'add_fee.html';
    } else {
        alert('Please login first.');
        location.href = 'login.html';
    }
});

document.getElementById('show-course-btn').addEventListener('click', function () {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
        location.href = 'show_fee_details.html';
    } else {
        alert('Please login first.');
        location.href = 'login.html';
    }
});