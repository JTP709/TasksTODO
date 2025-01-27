const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.userId = decoded.indexOf;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" })
  }
}