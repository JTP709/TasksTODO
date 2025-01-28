const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  console.log({
    token,
    cookies: req.cookies,
    headers: req.headers,
  })

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

module.exports = authentication;