const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authentication = require(path.resolve(__dirname, './middleware/authentication'));

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


const db = new sqlite3.Database(path.resolve(__dirname, './model/todo.db'));

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

app.post('/api/auth/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password ) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ message: "Username already exists" })
        return;
      } else {
        console.error(err);
        res.status(500).json({ message: err.message });
      }
    } else {
      res.status(201).json({ message: "User created successfully" });
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    } else {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return; 
      } else {
        const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          maxAge: 60 * 60 * 1000,
        });

        res.status(200).json({ message: "Login successful" });
      }
    }
  });
});

app.use('/api/tasks', authentication);

app.get('/api/tasks', (req, res) => {
  const userId = req.userId;

  db.all('SELECT * FROM tasks WHERE userId = ?', [userId], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
      return;
    }

    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const userId = req.userId;
  const { title } = req.body;

  db.run('INSERT INTO tasks (userId, title, completed) VALUES (?, ?, ?)', [userId, title, false], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: err.message || 'An error has occurred' });
    } else {
      db.get('SELECT last_insert_rowid() AS id', (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: err.message || 'Internal server error' });
        } else {
          res.status(201).json({ id: row.id, title, completed: false });
        }
      });
    }
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const userId = req.userId;
  const { title, completed } = req.body;

  db.run(`
    UPDATE tasks 
    SET title = COALESCE(?, title), completed = COALESCE(?, completed)
    WHERE userId = ?;
  `, [title, completed, userId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: err.message || "Internal server error" });
    } else {
      db.get("SELECT last_insert_rowid() AS id", (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: err.message || 'Internal server error' });
        } else {
          res.status(201).json({ message: `Task ${row.id} has been updated` });
        }
      });
    }
  });
});
