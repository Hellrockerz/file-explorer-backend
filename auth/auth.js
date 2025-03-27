const jwt = require("jsonwebtoken");
const secretKey = 'secretkey';

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Token has expired' }); r
    } else {
      console.error("Error saving user:", error);
      res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
  }
}
function tokenGenerator(res, data, message) {
  const token = jwt.sign(
    { id: data._id, email: data.email },
    secretKey,
    { expiresIn: "30d" }
  );
  console.log(data);
  if (message) {
    return res.status(201).json({ message: message, token, data })
  }
  return res.status(201).json({ message: "Logged in successfully", token, data });
}

module.exports = { verifyToken, tokenGenerator }