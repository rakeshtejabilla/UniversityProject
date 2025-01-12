// forgot_password.js

document.getElementById("forgot-password-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    const email = document.getElementById("email").value;
    
    if (validateEmail(email)) {
        // Simulate a successful reset link sent (In a real app, you'd send a request to the backend here)
        document.getElementById("success-message").style.display = "block";
        document.getElementById("error-message").style.display = "none";
    } else {
        // If email validation fails
        document.getElementById("error-message").innerText = "Please enter a valid email address.";
        document.getElementById("error-message").style.display = "block";
    }
});

// Basic email validation function
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
}
