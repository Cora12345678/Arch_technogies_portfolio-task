const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const db = new sqlite3.Database('./messages.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            subject TEXT,
            message TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Email Transporter (Placeholder - user needs to configure .env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide name, email, and message.' });
    }

    // 1. Save to Database
    const sql = `INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, email, subject, message], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Failed to save message to database.' });
        }

        console.log(`Message from ${name} saved with ID: ${this.lastID}`);

        // 2. Send Email
        const mailOptions = {
            from: email,
            to: 'areebasajjad.2004@gmail.com',
            subject: `New Portfolio Message: ${subject || 'No Subject'}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        };

        // Note: This will only work if EMAIL_USER and EMAIL_PASS are configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Email error:', error);
                    // Still return 200 because it was saved to DB
                    return res.status(200).json({
                        message: 'Message saved to database, but email failed to send.',
                        id: this.lastID
                    });
                }
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Message sent successfully!', id: this.lastID });
            });
        } else {
            res.status(200).json({
                message: 'Message saved to database. (Email not sent - credentials missing)',
                id: this.lastID
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
