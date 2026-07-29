const express = require("express");
const router = express.Router();
const controller = require("../controllers/tentativoTest.controller");
const authMiddleware = require("../middleware/authMiddleware");

// POST → salvare un tentativo
router.post("/", controller.createTentativoTest);

// GET -> tutti i tentativi di un utente tramite codiceGioco
router.get("/tentativi/:codiceGioco",authMiddleware,controller.getTestByUtente);
// GET -> tutti i tentativi nel db
router.get("/tutti", authMiddleware, controller.getAllTentativi);

module.exports = router;
