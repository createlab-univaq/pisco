const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  try {
    // 1. prendo header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token mancante o formato non valido",
      });
    }

    // 2. estraggo token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token non valido",
      });
    }

    // 3. verifico token
    const decoded = jwt.verify(token, SECRET_KEY);

    // 4. salvo dati utente nella request
    req.user = decoded;

    // 5. passo al controller successivo
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token non valido o scaduto",
    });
  }
};

module.exports = authMiddleware;
