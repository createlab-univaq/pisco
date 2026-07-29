const Utente = require('../models/utente');

const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // caratteri leggibili, senza O,0,I,1

async function generaCodiceGiocoUnico() {
  let codice;
  let esiste;

  do {
    codice = '';
    for (let i = 0; i < 6; i++) {
      codice += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // controlla unicità nel DB
    esiste = await Utente.exists({ codiceGioco: codice });

  } while (esiste);

  return codice;
}

module.exports = generaCodiceGiocoUnico;