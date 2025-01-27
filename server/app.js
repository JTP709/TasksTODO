const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const db = new sqlite3.Database(path.resolve(__dirname, './model/todo.db'));

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

app.post('/auth/signup', async (req, res) => {
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

app.post('/auth/login', (req, res) => {
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
        res.json({ token });
      }
    }
  });
});
