const mongoose = require('mongoose');

const DomandaSchema = new mongoose.Schema({
  indice: {
    type: Number,
    required: true
  },
  correct: {
    type: Boolean,
    required: true
  },
  reactionTime: {
    type: Number,
    required: true
  }
}, { _id: false });

const TentativoTestSchema = new mongoose.Schema({

  utenteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utente',
    required: true,
    index: true
  },

  // Identificativo del test
  testId: {
    type: String,
    required: true
  },

  // Nome leggibile del test
  nomeTest: {
    type: String,
    required: true
  },

  // PRE o POST esercitazione
  tipoTest: {
    type: String,
    enum: ['pre', 'post'],
    required: true
  },

  // Percorso
  percorsoId: {
    type: String,
    required: true
  },

  // Esito
  superato: {
    type: Boolean,
    required: true
  },

  // Tempo medio di reazione
  tempoMedioReazione: {
    type: Number,
    required: true
  },

  movimentoMouse: {
    type: Number,
    required: true
  },

  // Dettaglio domande
  domande: {
    type: [DomandaSchema],
    required: true
  }

}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('TentativoTest', TentativoTestSchema);
