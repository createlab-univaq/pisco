const Utente = require('../models/utente');

async function salvaDiagnosi(req, res) {
  try {
    const { testo, livelloGravita, note } = req.body;

    if (!testo || !livelloGravita) {
      return res.status(400).json({ message: 'Campi obbligatori mancanti' });
    }

    const utente = await Utente.findOneAndUpdate(
      { _id: req.params.id, analistaId: req.user.id },
      {
        diagnosi: {
          testo,
          livelloGravita,
          note: note ?? null,
          dataInserimento: new Date(),
        },
      },
      { new: true },
    );

    if (!utente) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    res.status(200).json(utente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function eliminaDiagnosi(req, res) {
  try {
    const utente = await Utente.findOneAndUpdate(
      { _id: req.params.id, analistaId: req.user.id },
      { $unset: { diagnosi: "" } },
      { new: true },
    );

    if (!utente) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    res.status(200).json(utente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  salvaDiagnosi,
  eliminaDiagnosi,
}