// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// Registration route
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate the input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // SQL query to insert user into the database
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

    db.run(sql, [username, password], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ message: 'Username already exists.' });
            }
            return res.status(500).json({ message: 'Error registering user.' });
        }

        res.json({ message: 'Registration successful!' });
        
    });
});



app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(sql, [username, password], (err, user) => {
        if (err || !user) {
            return res.json({ success: false, message: 'Invalid username or password' });
        }
        res.json({ success: true, message: 'Login successful' });
    });
});

// Add student and fee details
app.post('/submit', (req, res) => {
    const { name, father_name, course_type, course_name, ht_no, year, semester, bank_name, utr_no, fee_amount, payment_date, purpose } = req.body;

    // Check if the UTR number already exists
    const checkUtrSql = `SELECT * FROM fees WHERE utr_no = ?`;
    db.get(checkUtrSql, [utr_no], function(err, fee) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (fee) {
            // UTR number already exists
            return res.status(400).json({ error: 'UTR number already exists. Please enter a different UTR number.' });
        } else {
            // Proceed to check if the student exists
            const checkStudentSql = `SELECT * FROM students WHERE name = ? AND father_name = ? AND course_type = ? AND course_name = ? AND ht_no = ? AND year = ? AND semester = ?`;
            db.get(checkStudentSql, [name, father_name, course_type, course_name, ht_no, year, semester], function(err, student) {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }

                if (student) {
                    // Student exists, add the fee details
                    const feeSql = `INSERT INTO fees (student_id, bank_name, utr_no, fee_amount, payment_date, purpose) VALUES (?, ?, ?, ?, ?, ?)`;
                    db.run(feeSql, [student.id, bank_name, utr_no, fee_amount, payment_date, purpose], function(err) {
                        if (err) {
                            return res.status(400).json({ error: err.message });
                        }
                        res.json({ message: 'Fee details added to existing student', feeId: this.lastID });
                    });
                } else {
                    // Student does not exist, add the student and fee details
                    const studentSql = `INSERT INTO students (name, father_name, course_type, course_name, ht_no, year, semester) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    db.run(studentSql, [name, father_name, course_type, course_name, ht_no, year, semester], function(err) {
                        if (err) {
                            return res.status(400).json({ error: err.message });
                        }
                        const studentId = this.lastID;
                        const feeSql = `INSERT INTO fees (student_id, bank_name, utr_no, fee_amount, payment_date, purpose) VALUES (?, ?, ?, ?, ?, ?)`;
                        db.run(feeSql, [studentId, bank_name, utr_no, fee_amount, payment_date, purpose], function(err) {
                            if (err) {
                                return res.status(400).json({ error: err.message });
                            }
                            res.json({ message: 'Student and fee details added', studentId, feeId: this.lastID });
                        });
                    });
                }
            });
        }
    });
});

// Get student details along with student ID
app.get('/fees', (req, res) => {
    const { course_type, course_name } = req.query;
    const sql = `SELECT students.id, students.name, students.father_name, students.course_name, students.ht_no, students.year, students.semester, 
                        fees.bank_name, fees.utr_no, fees.fee_amount, fees.payment_date, fees.purpose
                 FROM fees 
                 JOIN students ON fees.student_id = students.id 
                 WHERE students.course_type = ? AND students.course_name = ?`;
    db.all(sql, [course_type, course_name], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);  // Ensure 'id' is included in the response
    });
});


app.get('/fees/by-date', (req, res) => {
    const { from_date, to_date } = req.query;

    // Check if both from_date and to_date are provided
    if (!from_date || !to_date) {
        return res.status(400).json({ error: 'Please provide both from_date and to_date' });
    }

    const sql = `
        SELECT students.id,students.name, students.father_name, students.course_type, students.course_name, students.ht_no, students.year, students.semester, 
               fees.bank_name, fees.utr_no, fees.fee_amount, fees.payment_date, fees.purpose 
        FROM students 
        INNER JOIN fees ON students.id = fees.student_id 
        WHERE fees.payment_date BETWEEN ? AND ?
        ORDER BY fees.payment_date ASC
    `;

    db.all(sql, [from_date, to_date], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (rows.length === 0) {
            return res.json({ message: 'No fees found in the given date range' });
        }

        res.json(rows);
    });
});

// Get fee details by UTR number
app.get('/fees/utr/:utr_no', (req, res) => {
    const utrNo = req.params.utr_no;
    const sql = `SELECT students.id,students.name, students.father_name, students.course_name, students.ht_no, students.year, students.semester, fees.bank_name, fees.utr_no, fees.fee_amount, fees.payment_date, fees.purpose
                 FROM fees 
                 JOIN students ON fees.student_id = students.id 
                 WHERE fees.utr_no = ?`;
    db.all(sql, [utrNo], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});



// Get student details by ID
app.get('/students/:id', (req, res) => {
    const { id } = req.params;

    // Query to get student details
    const studentSql = `SELECT * FROM students WHERE id = ?`;

    // Execute the query to get student details
    db.get(studentSql, [id], (err, student) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // If student is found, fetch the associated fee details
        const feeSql = `SELECT * FROM fees WHERE student_id = ?`;
        db.get(feeSql, [id], (err, fee) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            // Combine student and fee details in a single response
            const studentDetails = {
                ...student,  // Spread student details
                ...fee       // Spread fee details (if fee exists)
            };

            res.json(studentDetails);
        });
    });
});

// Update student and fee details
app.put('/students/:id', (req, res) => {
    const studentId = req.params.id;
    const {
        name, father_name, course_type, course_name, ht_no, year, semester,
        bank_name, utr_no, fee_amount, payment_date, purpose
    } = req.body;

    // Update student details
    const updateStudentSql = `
        UPDATE students SET name = ?, father_name = ?, course_type = ?, course_name = ?, ht_no = ?, year = ?, semester = ? 
        WHERE id = ?
    `;
    db.run(updateStudentSql, [name, father_name, course_type, course_name, ht_no, year, semester, studentId], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        // Update fee details
        const updateFeeSql = `
            UPDATE fees SET bank_name = ?, utr_no = ?, fee_amount = ?, payment_date = ?, purpose = ? 
            WHERE student_id = ?
        `;
        db.run(updateFeeSql, [bank_name, utr_no, fee_amount, payment_date, purpose, studentId], function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            res.json({ message: 'Student and fee details updated successfully' });
        });
    });
});





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
