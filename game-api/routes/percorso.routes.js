const express = require("express");
const router = express.Router();

const { listaPercorsi } = require("../controllers/percorso.controller");
const authMiddleware = require("../middleware/authMiddleware");

// Catalogue of Polyglot flows available to assign (proxied server-side)
router.get("/percorsi", authMiddleware, listaPercorsi);

module.exports = router;
