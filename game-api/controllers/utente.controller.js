const Utente = require("../models/utente");
const tentativoTest = require("../models/tentativoTest");
const generaCodiceGiocoUnico = require("../utils/codiceGiocoGenerator");

// POST /utente
const creaUtente = async (req, res) => {
  try {
    const {
      nome,
      cognome,
      dataNascita,
      sesso,
      email,
      numTelefono,
      scuolaFrequentata,
      titoloStudio,
    } = req.body;
    const codiceGioco = await generaCodiceGiocoUnico();
    const nuovoUtente = await Utente.create({
      nome,
      cognome,
      dataNascita,
      sesso,
      email,
      numTelefono,
      scuolaFrequentata,
      titoloStudio,
      codiceGioco,
      analistaId: req.user.id,
    });
    res.status(201).json({ nuovoUtente });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /utente
const listaUtenti = async (req, res) => {
  try {
    const utenti = await Utente.find({ analistaId: req.user.id });
    res.json(utenti);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const assegnaPercorso = async (req, res) => {
  try {
    const { id } = req.params;
    const { percorsoIdEsterno, nomePercorso } = req.body;

    if (!percorsoIdEsterno || !nomePercorso) {
      return res.status(400).json({ message: "Dati percorso mancanti" });
    }

    const utente = await Utente.findOne({ _id: id, analistaId: req.user.id });

    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // evita duplicati
    const giàAssegnato = utente.percorsiAssegnati.some(
      (p) => p.percorsoIdEsterno === percorsoIdEsterno,
    );

    if (giàAssegnato) {
      return res.status(200).json({ message: "Percorso già assegnato" });
    }

    utente.percorsiAssegnati.push({
      percorsoIdEsterno,
      nomePercorso,
    });

    await utente.save();

    res.status(200).json({ utente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server" });
  }
};

const getPercorsiAssegnati = async (req, res) => {
  try {
    const { codiceGioco } = req.params;

    const utente = await Utente.findOne({ codiceGioco }).select(
      "percorsiAssegnati",
    );

    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json(utente.percorsiAssegnati);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server" });
  }
};

const removePercorsoAssegnato = async (req, res) => {
  try {
    const { id, percorsoIdEsterno } = req.params;

    const utente = await Utente.findOneAndUpdate(
      { _id: id, analistaId: req.user.id },
      {
        $pull: {
          percorsiAssegnati: {
            percorsoIdEsterno: percorsoIdEsterno,
          },
        },
      },
      { new: true },
    );

    if (!utente) {
      return res.status(404).json({
        message: "Utente non trovato",
      });
    }

    res.status(200).json({
      message: "Percorso rimosso con successo",
      percorsiAssegnati: utente.percorsiAssegnati,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Errore server",
    });
  }
};

// PATCH /utenti/:codiceGioco/progressi
const updateProgressiGioco = async (req, res) => {
  try {
    const { codiceGioco } = req.params;
    const {
      tipoAvatar,
      Livello_Attuale,
      lookAttuale,
      inventario,
      moneteNotifier,
      percorsoId,
      Completato,
    } = req.body;

    // Costruisco oggetto aggiornamenti SOLO con campi permessi
    const aggiornamenti = {};

    if (inventario && typeof inventario === "object") {
      aggiornamenti.inventario = inventario;
    }

    if (lookAttuale && typeof lookAttuale === "object") {
      aggiornamenti.lookAttuale = lookAttuale;
    }

    if (typeof tipoAvatar === "number") {
      aggiornamenti.tipoAvatar = tipoAvatar;
    }

    if (typeof moneteNotifier === "number") {
      aggiornamenti.moneteNotifier = moneteNotifier;
    }

    const aggiornamentiPercorso = {};

    if (typeof Livello_Attuale === "number") {
      aggiornamentiPercorso["percorsiAssegnati.$.Livello_Attuale"] =
        Livello_Attuale;
    }

    if (typeof Completato === "boolean") {
      aggiornamentiPercorso["percorsiAssegnati.$.Completato"] = Completato;
    }

    if (
      Object.keys(aggiornamenti).length === 0 &&
      Object.keys(aggiornamentiPercorso).length === 0
    ) {
      return res.status(400).json({
        message: "Nessun campo valido da aggiornare",
      });
    }

    console.log("Aggiornamenti inviati:", aggiornamenti);

    const utenteAggiornato = await Utente.findOneAndUpdate(
      { codiceGioco, "percorsiAssegnati.percorsoIdEsterno": percorsoId },
      {
        $set: {
          ...aggiornamenti,
          ...aggiornamentiPercorso,
        },
      },
      { new: true },
    );

    if (!utenteAggiornato) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json(utenteAggiornato);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore server" });
  }
};

const getDatiUtentePerGioco = async (req, res) => {
  try {
    const { codiceGioco } = req.params;

    // Trova il utente tramite codiceGioco
    const utente = await Utente.findOne(
      { codiceGioco },
      "tipoAvatar lookAttuale inventario moneteNotifier", // campi da restituire
    );

    if (!utente) {
      return res.status(404).json({ error: "Codice gioco non valido" });
    }

    // Risposta JSON al gioco
    res.json(utente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCtxPercorso = async (req, res) => {
  try {
    const { codiceGioco } = req.params;
    const { percorsoId, ctxId } = req.body;

    if (!percorsoId || !ctxId) {
      return res.status(400).json({
        message: "percorsoId e ctxId sono obbligatori",
      });
    }

    const result = await Utente.updateOne(
      {
        codiceGioco,
        "percorsiAssegnati.percorsoIdEsterno": percorsoId,
      },
      {
        $set: {
          "percorsiAssegnati.$.ctxId": ctxId,
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Utente o percorso non trovato",
      });
    }

    res.status(200).json({
      message: "ctxId aggiornato correttamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Errore server",
    });
  }
};

const deleteUtenti = async (req, res) => {
  try {
    const { userIds } = req.body;

    // validazione
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        message: "Lista userIds non valida",
      });
    }

    const utentiDiProprieta = await Utente.find({
      _id: { $in: userIds },
      analistaId: req.user.id,
    }).select("_id");

    if (utentiDiProprieta.length !== userIds.length) {
      return res.status(403).json({
        message:
          "Non puoi eliminare utenti che non appartengono al tuo account",
      });
    }

    const ownedIds = utentiDiProprieta.map((u) => u._id);

    await tentativoTest.deleteMany({
      utenteId: { $in: ownedIds },
    });

    const result = await Utente.deleteMany({
      _id: { $in: ownedIds },
      analistaId: req.user.id,
    });

    res.status(200).json({
      message: "Utenti e tentativi eliminati con successo",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Errore server durante eliminazione",
    });
  }
};

module.exports = {
  creaUtente,
  listaUtenti,
  assegnaPercorso,
  getPercorsiAssegnati,
  removePercorsoAssegnato,
  updateProgressiGioco,
  getDatiUtentePerGioco,
  updateCtxPercorso,
  deleteUtenti,
};
