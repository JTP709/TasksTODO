const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAuthControllers = (db) => ({
  signup: async (req, res) => {
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
  },
  login: (req, res) => {
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
  },
  logout: (_, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      expires: new Date(0),
    });
  
    res.status(200).json({ message: 'Logout successful' });
  },
});

module.exports = getAuthControllers;