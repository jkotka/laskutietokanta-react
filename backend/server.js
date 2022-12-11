const express = require('express');
const sqlite = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
let port = process.env.PORT || 3001;

// Database
const db = new sqlite.Database('./bills.db', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Yhdistetty tietokantaan');
    }
});

// Table
db.run(`CREATE TABLE IF NOT EXISTS bills (
            id INTEGER PRIMARY KEY,
            date TEXT NOT NULL,
            sum INTEGER NOT NULL,
            name TEXT NOT NULL,
            in_account INTEGER NOT NULL DEFAULT 0,
            in_payment INTEGER NOT NULL DEFAULT 0,
            paid INTEGER NOT NULL DEFAULT 0
        );`
);

// Read
app.get('/read', (req, res) => {
    const paid = req.query.paid;
    let placeholders = [paid];
    let searchQuery = '';
    if (req.query.from) {
        searchQuery += ' AND date >= ? ';
        placeholders.push(req.query.from);
    }
    if (req.query.to) {
        searchQuery += ' AND date <= ? ';
        placeholders.push(req.query.to);
    }
    if (req.query.name) {
        searchQuery += ' AND name LIKE ? ';
        placeholders.push(req.query.name + '%');
    }
    let sql = `SELECT COUNT(*) AS count, CAST(SUM(sum) AS FLOAT) / 100 AS sum, in_account
                FROM bills
                WHERE paid = ? `
                + searchQuery +
                `GROUP BY in_account;`;
    if (req.query.offset && req.query.limit) {
        sql = `SELECT id, date, CAST(sum AS FLOAT) / 100 AS sum, name, in_account, in_payment, paid
                FROM bills
                WHERE paid = ? `
                + searchQuery +
                `ORDER BY date, name LIMIT ?, ?;`;
        placeholders.push(parseInt(req.query.offset), parseInt(req.query.limit));
    }
    db.all(sql, placeholders, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Create
app.post('/create', (req, res) => {
    const date = req.body.date;
    const sum = Math.round(req.body.sum * 100);
    const name = req.body.name;
    db.run(`INSERT INTO bills (date, sum, name)
            VALUES (?, ?, ?);`,
        [date, sum, name],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Update
app.put('/update', (req, res) => {
    const date = req.body.date;
    const sum = Math.round(req.body.sum * 100);
    const name = req.body.name;
    const in_account = req.body.in_account;
    const in_payment = req.body.in_payment;
    const paid = req.body.paid;
    const id = req.body.id;
    db.run(`UPDATE bills
            SET date = ?, sum = ?, name = ?, in_account = ?, in_payment = ?, paid = ?
            WHERE id = ?;`,
        [date, sum, name, in_account, in_payment, paid, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// Delete
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM bills
            WHERE id = ?;`,
        id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Listen
app.listen(port, () => {
    console.log('Serveri päällä portissa', port)
});