const Utente = require("../models/utente");
const TentativoTest = require("../models/tentativoTest");

/**
 * POST /api/tentativi-test
 * Salva un tentativo di test inviato dal gioco
 */
exports.createTentativoTest = async (req, res) => {
  try {
    const {
      codiceGioco,
      testId,
      nomeTest,
      tipoTest,
      percorsoId,
      superato,
      tempoMedioReazione,
      movimentoMouse,
      domande,
    } = req.body;

    // Trova l'utente tramite codiceGioco
    const utente = await Utente.findOne({ codiceGioco });
    if (!utente) {
      return res.status(404).json({ error: "Codice gioco non valido" });
    }

    // Crea un nuovo tentativoTest
    const tentativo = new TentativoTest({
      utenteId: utente._id,
      testId,
      nomeTest,
      tipoTest,
      percorsoId,
      superato,
      tempoMedioReazione,
      movimentoMouse,
      domande,
    });

    // Salva nel DB
    await tentativo.save();

    // Risposta OK
    res.status(201).json(tentativo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET -> tutti i tentativi di un utente
exports.getTestByUtente = async (req, res) => {
  try {
    const { codiceGioco } = req.params;

    const utente = await Utente.findOne({
      codiceGioco,
      analistaId: req.user.id,
    });
    if (!utente) return res.status(404).json({ message: "Utente non trovato" });

    const tentativi = await TentativoTest.find({ utenteId: utente._id });

    return res.status(200).json(tentativi);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Errore del server" });
  }
};

exports.getAllTentativi = async (req, res) => {
  try {
    const utenti = await Utente.find({
      analistaId: req.user.id,
    }).select("_id");

    const utentiIds = utenti.map((u) => u._id);

    const tentativi = await TentativoTest.find({
      utenteId: { $in: utentiIds },
    });
    return res.status(200).json(tentativi);
  } catch (error) {
    return res.status(500).json({ message: "Errore server" });
  }
};
