
        // Get the student ID from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const studentId = urlParams.get('id');

        // Fetch and load the student and fee details on page load
        window.onload = function() {
            fetch(`/students/${studentId}`)
                .then(response => response.json())
                .then(data => {
                    // Populate student details
                    document.getElementById('name').value = data.name;
                    document.getElementById('father_name').value = data.father_name;
                    document.getElementById('course_type').value = data.course_type;
                    document.getElementById('course_name').value = data.course_name;
                    document.getElementById('ht_no').value = data.ht_no;
                    document.getElementById('year').value = data.year;
                    document.getElementById('semester').value = data.semester;

                    // Populate fee details
                    document.getElementById('bank_name').value = data.bank_name;
                    document.getElementById('utr_no').value = data.utr_no;
                    document.getElementById('fee_amount').value = data.fee_amount;
                    document.getElementById('payment_date').value = data.payment_date;
                    document.getElementById('purpose').value = data.purpose;
                })
                .catch(error => console.error('Error:', error));
        };

        // Handle form submission to update student and fee details
        document.getElementById('edit-student-fee-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const data = {
                name: e.target.name.value,
                father_name: e.target.father_name.value,
                course_type: e.target.course_type.value,
                course_name: e.target.course_name.value,
                ht_no: e.target.ht_no.value,
                year: e.target.year.value,
                semester: e.target.semester.value,
                bank_name: e.target.bank_name.value,
                utr_no: e.target.utr_no.value,
                fee_amount: e.target.fee_amount.value,
                payment_date: e.target.payment_date.value,
                purpose: e.target.purpose.value,
            };

            fetch(`/students/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.href = 'index.html';  // Redirect after successful update
            })
            .catch(error => console.error('Error:', error));
        });