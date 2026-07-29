const express = require("express");
const router = express.Router();
const {
  creaUtente,
  listaUtenti,
  assegnaPercorso,
  getPercorsiAssegnati,
  removePercorsoAssegnato,
  updateProgressiGioco,
  getDatiUtentePerGioco,
  updateCtxPercorso,
  deleteUtenti,
} = require("../controllers/utente.controller");
const utente = require("../models/utente");

const {
  salvaDiagnosi,
  eliminaDiagnosi,
} = require("../controllers/diagnosi.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/utente", authMiddleware, creaUtente);
router.get("/utente", authMiddleware, listaUtenti);
router.post("/utenti/delete", authMiddleware, deleteUtenti);

router.post("/utenti/:id/assegna-percorso", authMiddleware, assegnaPercorso);
router.get("/utenti/:codiceGioco/percorsi", getPercorsiAssegnati);

router.delete(
  "/utenti/:id/percorsi/:percorsoIdEsterno",
  authMiddleware,
  removePercorsoAssegnato,
);

router.patch("/utenti/:codiceGioco/progressi", updateProgressiGioco);
router.get("/utente/:codiceGioco", getDatiUtentePerGioco);
router.patch("/utenti/:codiceGioco/ctx", updateCtxPercorso);

router.put("/utenti/:id/diagnosi", authMiddleware, salvaDiagnosi);
router.delete("/utenti/:id/diagnosi", authMiddleware, eliminaDiagnosi);

module.exports = router;
