document.getElementById("forgot-password-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const forgotPasswordEmail = document.getElementById("email").value;
    
    if (validateEmail(forgotPasswordEmail)) {
        // Send request to backend to check if email exists
        fetch('/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ forgotPasswordEmail })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Get the container div
                const otpFieldsDiv = document.getElementById("email-section");

                // Get all the form elements inside the div (e.g., input, button)
                const inputsAndButtons = otpFieldsDiv.querySelectorAll("input, button, select, textarea");

                // Loop through each element and disable it
                inputsAndButtons.forEach(element => {
                    element.disabled = true;
                    element.style.cursor = "not-allowed";
                });
                document.getElementById("success-message").style.display = "block";
                document.getElementById("otp-section").style.display = "block";
                localStorage.setItem('forgotPasswordEmail', forgotPasswordEmail);
            } else {
                document.getElementById("error-message").style.display = "block";
            }
        })
        .catch(error => {
            console.error("Error checking email:", error);
        });
    } else {
        document.getElementById("error-message").innerText = "Please enter a valid email address.";
        document.getElementById("error-message").style.display = "block";
    }
});

// OTP Verification
document.getElementById("verify-otp-btn").addEventListener("click", function() {
    const otp = document.getElementById("otp").value;
    const forgotPasswordEmail = localStorage.getItem('forgotPasswordEmail');
    fetch('/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, forgotPasswordEmail })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("otp-error-message").style.display = "none";
            // Get the container div
            const otpFieldsDiv = document.getElementById("otp-fields");

            // Get all the form elements inside the div (e.g., input, button)
            const inputsAndButtons = otpFieldsDiv.querySelectorAll("input, button, select, textarea");

            // Loop through each element and disable it
            inputsAndButtons.forEach(element => {
                element.disabled = true;
                element.style.cursor = "not-allowed";
            });

            document.getElementById("password-fields").style.display = "block";
        } else {
            document.getElementById("otp-error-message").style.display = "block";
        }
    })
    .catch(error => {
        console.error("Error verifying OTP:", error);
    });
});

// Reset Password
document.getElementById("otp-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const forgotPasswordEmail = localStorage.getItem('forgotPasswordEmail');

    if (newPassword === confirmPassword) {
        // Send request to backend to reset password
        fetch('/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword, forgotPasswordEmail })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Password reset successfully! Redirecting to login.");
                window.location.href = "/login.html";
            } else {
                alert("Error resetting password.");
            }
        })
        .catch(error => {
            console.error("Error resetting password:", error);
        });
    } else {
        alert("Passwords do not match.");
    }
});

// Resend OTP
document.getElementById("resend-otp-btn").addEventListener("click", function() {
    const forgotPasswordEmail = localStorage.getItem('forgotPasswordEmail');

    fetch('/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forgotPasswordEmail })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("OTP has been resent.");
        } else {
            alert("Error resending OTP.");
        }
    })
    .catch(error => {
        console.error("Error resending OTP:", error);
    });
});

// Basic email validation function
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
}