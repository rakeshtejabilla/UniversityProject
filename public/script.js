// Populate course names based on the selected course type
const courseTypeSelect = document.getElementById('course_type');
const courseNameSelect = document.getElementById('course_name');

// Define the course names for each course type
const courseNames = {
  'UG': ['CSE', 'IT', 'ECE', 'MECH', 'EEE', 'Civil'],
  'PG': ['MCA', 'MBA', 'MTECH'],
  'Prof': ['BBA', 'BCA', 'BCom'],
  'Non-Prof': ['Diploma', 'Certificate']
};


courseTypeSelect.addEventListener('change', () => {
  // Get the selected course type
  const selectedCourseType = courseTypeSelect.value;
  courseNameSelect.disabled = false;

  // Clear the course name select element
  courseNameSelect.innerHTML = '';

  // Add options to the course name select element based on the selected course type
  courseNames[selectedCourseType].forEach((courseName) => {
    const option = document.createElement('option');
    option.value = courseName;
    option.text = courseName;
    courseNameSelect.appendChild(option);
  });
});

function showOtherPurpose() {
  const purposeSelect = document.getElementById('purpose');
  const otherPurposeContainer = document.getElementById('other-purpose-container');

  // Check if "Other" is selected, show text field if true
  if (purposeSelect.value === 'Other') {
      otherPurposeContainer.style.display = 'block';
  } else {
      otherPurposeContainer.style.display = 'none';
  }
}

// Handle submission of student fee details
document.getElementById('submission-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form values
  let purposeValue = e.target.purpose.value;

  // Check if the selected purpose is "Other"
  if (purposeValue === 'Other') {
    purposeValue = e.target.other_purpose.value; // Use the custom purpose entered by the user
  }

  // Construct the data object
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
    purpose: purposeValue // Use the correct purpose value
  };

  // Fetch request to the server
  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    
    if (data.error) {
      // If there's an error, clear the UTR field for the user to correct
      e.target.utr_no.value = '';
    } else {
      // Reset the form if successful
      e.target.reset();
      document.getElementById('other-purpose-container').style.display = 'none'; // Hide the other purpose field
    }
  })
  .catch(error => console.error('Error:', error));
});

// Handle fetching fee details by course type and name
document.getElementById('course-fee-details-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const courseType = e.target.course_type.value;
  const courseName = e.target.course_name.value;
  
  fetch(`/fees?course_type=${courseType}&course_name=${courseName}`)
    .then(response => response.json())
    .then(data => {
      const details = document.getElementById('course-fee-details');
      details.innerHTML = renderTable(data);
    })
    .catch(error => console.error('Error:', error));
});

// Handle fetching fee details by UTR number
document.getElementById('utr-fee-details-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const utrNo = e.target.utr_no.value;
  
  fetch(`/fees/utr/${utrNo}`)
    .then(response => response.json())
    .then(data => {
      const details = document.getElementById('utr-fee-details');
      details.innerHTML = renderTable(data);
    })
    .catch(error => console.error('Error:', error));
});

// Handle fetching fee details by date range
document.getElementById('date-fee-details-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const fromDate = e.target.from_date.value;
  const toDate = e.target.to_date.value;
  
  fetch(`/fees/by-date?from_date=${fromDate}&to_date=${toDate}`)
    .then(response => response.json())
    .then(data => {
      const details = document.getElementById('date-fee-details');
      details.innerHTML = renderTable(data);
    })
    .catch(error => console.error('Error:', error));
});


// Function to render fee details in a table
function renderTable(data) {
    let table = `<table>
        <tr>
            <th>Name</th>
            <th>Father Name</th>
            <th>Course Name</th>
            <th>HT No</th>
            <th>Year</th>
            <th>Semester</th>
            <th>Bank Name</th>
            <th>UTR No</th>
            <th>Fee Amount</th>
            <th>Payment Date</th>
            <th>Purpose</th>
            <th>Edit</th>
        </tr>`;

    data.forEach(student => {
        table += `
            <tr>
                <td>${student.name}</td>
                <td>${student.father_name}</td>
                <td>${student.course_name}</td>
                <td>${student.ht_no}</td>
                <td>${student.year}</td>
                <td>${student.semester}</td>
                <td>${student.bank_name}</td>
                <td>${student.utr_no}</td>
                <td>${student.fee_amount}</td>
                <td>${student.payment_date}</td>
                <td>${student.purpose}</td>
                <td><button onclick="location.href='edit_student.html?id=${student.id}'">Edit</button></td>
            </tr>`;
    });

    table += `</table>`;
    return table;
}

function logout() {
   localStorage.clear();
   alert('Logout successful');
  location.href = 'index.html'
}

function printDetails() {
  const printContent = document.getElementById('course-fee-details').innerHTML;
  const originalContent = document.body.innerHTML;

  // Replace body content with student details to print
  document.body.innerHTML = printContent;

  // Trigger the print dialog
  window.print();

  // Restore the original page content after printing
  document.body.innerHTML = originalContent;
}

function printutr() {
  const printContent = document.getElementById('utr-fee-details').innerHTML;
  const originalContent = document.body.innerHTML;

  // Replace body content with student details to print
  document.body.innerHTML = printContent;

  // Trigger the print dialog
  window.print();

  // Restore the original page content after printing
  document.body.innerHTML = originalContent;
}

function printByDate() {
  const printContent = document.getElementById('date-fee-details').innerHTML;
  const originalContent = document.body.innerHTML;

  // Replace body content with student details to print
  document.body.innerHTML = printContent;

  // Trigger the print dialog
  window.print();

  // Restore the original page content after printing
  document.body.innerHTML = originalContent;
}