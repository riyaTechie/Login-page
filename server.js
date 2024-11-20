const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'your_login',
    password: 'Riya@30',
    port: 5432,
});

// Register User
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).send({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error registering user', error: err.message });
    }
});

// Login User
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            res.send({ message: 'Login successful' });
        } else {
            res.status(401).send({ message: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Error logging in', error: err.message });
    }
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
