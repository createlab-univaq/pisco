const { MongoTopologyClosedError } = require("mongodb");
const mongoose = require("mongoose");

const SCUOLE = [
  "Scuola_secondaria_di_primo_grado",
  "Scuola_secondaria_di_secondo_grado",
  "Universita",
  "Non_frequento",
  "Altro",
];

const TITOLI_STUDIO = [
  "Diploma_di_terza_media",
  "Diploma_di_scuola_superiore",
  "Laurea_di_I_livello",
  "Laurea_di_II_livello",
  "Master_dottorato_specializzazione",
];

const DiagnosiSchema = new mongoose.Schema(
  {
    testo: {
      type: String,
      required: true,
      trim: true,
    },
    livelloGravita: {
      type: String,
      enum: ["Livello_1", "Livello_2", "Livello_3"],
      required: true,
    },
    note: {
      type: String,
      default: null,
    },
    dataInserimento: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  { _id: false }, // 👈 importantissimo
);

const UtenteSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    cognome: {
      type: String,
      required: true,
    },
    dataNascita: {
      type: Date,
      required: true,
    },
    sesso: {
      type: String,
      enum: ["maschio", "femmina"],
      required: true,
    },
    codiceGioco: {
      type: String,
      required: true,
      unique: true,
      index: true,
      immutable: true,
    },

    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },

    numTelefono: {
      type: String,
      required: false,
    },

    scuolaFrequentata: {
      type: String,
      enum: SCUOLE,
      required: true,
    },

    titoloStudio: {
      type: String,
      enum: TITOLI_STUDIO,
      required: true,
    },

    analistaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analista",
      required: true,
    },

    diagnosi: {
      type: DiagnosiSchema,
      default: null,
    },

    percorsiAssegnati: [
      {
        percorsoIdEsterno: {
          type: String,
          required: true,
        },
        nomePercorso: {
          type: String,
          required: true,
        },
        assegnatoIl: {
          type: Date,
          default: Date.now,
        },
        ctxId: {
          type: String,
          default: null,
        },
        Livello_Attuale: {
          type: Number,
          default: 0,
        },
        Completato: {
          type: Boolean,
          default: false,
        },
      },
    ],
    tipoAvatar: {
      type: Number,
      default: null,
    },

    lookAttuale: {
      type: Map,
      of: String,
      default: {},
    },
    inventario: {
      type: Map,
      of: [String],
      default: {},
    },
    moneteNotifier: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Utente", UtenteSchema);
