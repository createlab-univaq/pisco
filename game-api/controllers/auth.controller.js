const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Analista = require("../models/analista");

const SECRET_KEY = process.env.JWT_SECRET;

const register = async (req, res) => {
  try {
    const { nome, cognome, dataNascita, email, password } = req.body;

    // 1. Controllo campi obbligatori
    if (!nome || !cognome || !dataNascita || !email || !password) {
      return res.status(400).json({
        message: "Tutti i campi sono obbligatori",
      });
    }

    // 2. Controllo email già esistente
    const analistaEsistente = await Analista.findOne({ email });

    if (analistaEsistente) {
      return res.status(400).json({
        message: "Email già registrata",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Creazione analista
    const nuovoAnalista = new Analista({
      nome,
      cognome,
      dataNascita,
      email,
      password: hashedPassword,
    });

    await nuovoAnalista.save();

    // 5. Risposta
    res.status(201).json({
      message: "Registrazione completata con successo",
    });
  } catch (error) {
    res.status(500).json({
      message: "Errore interno del server",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. controllo input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email e password obbligatorie",
      });
    }

    // 2. cerco utente
    const analista = await Analista.findOne({ email });

    if (!analista) {
      return res.status(401).json({
        message: "Utente non trovato",
      });
    }

    // 3. confronto password
    const isMatch = await bcrypt.compare(password, analista.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email e/o Password errate",
      });
    }

    // 4. creo JWT
    const token = jwt.sign(
      {
        id: analista._id,
        email: analista.email,
      },
      SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    // 5. risposta
    res.status(200).json({
      message: "Login effettuato",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Errore server",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
