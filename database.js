// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('university.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`); 
    
    // Create students table
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        father_name TEXT NOT NULL,
        course_type TEXT NOT NULL,
        course_name TEXT NOT NULL,
        ht_no TEXT NOT NULL,
        year INTEGER NOT NULL,
        semester INTEGER NOT NULL
    )`);

    // Create fees table
    db.run(`CREATE TABLE IF NOT EXISTS fees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        bank_name TEXT NOT NULL,
        utr_no TEXT NOT NULL,
        fee_amount REAL NOT NULL,
        payment_date TEXT NOT NULL,
        purpose TEXT NOT NULL,
        FOREIGN KEY(student_id) REFERENCES students(id)
    )`);
});

module.exports = db;
