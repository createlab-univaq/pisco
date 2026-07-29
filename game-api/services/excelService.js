// services/excelService.js
const ExcelJS = require("exceljs");

exports.createExcel = async (utente, tentativi) => {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Report");

  const tentativiPre = tentativi.filter(t => t.tipoTest === "pre");
  const tentativiPost = tentativi.filter(t => t.tipoTest === "post");

  const calcolaEta = (dataNascita) => {
  const oggi = new Date();
  const nascita = new Date(dataNascita);

  let eta = oggi.getFullYear() - nascita.getFullYear();
  const meseDiff = oggi.getMonth() - nascita.getMonth();

  // Se non ha ancora compiuto gli anni quest'anno
  if (meseDiff < 0 || (meseDiff === 0 && oggi.getDate() < nascita.getDate())) {
    eta--;
  }

  return eta;
};



  const columns = [
    { header: "ID", key: "codiceGioco", width: 20 },
    { header: "Cognome", key: "cognome", width: 20 },
    { header: "Nome", key: "nome", width: 15 },
    { header: "Età", key: "eta", width: 15},
    { header: "Genere", key: "sesso", width: 15},
    { header: "Scolarità", key: "titolo", width: 20},
    { header: "Scuola frequentata", key: "scuola", width: 20},
    { header: "Diagnosi", key: "diagnosi", width: 15},
    { header: "Altre note importanti", key: "note", width: 25},

  ];

   // Aggiungiamo colonne per i test pre
  tentativiPre.forEach((t) => {
    t.domande.forEach((d, i ) => {
      columns.push({
        header: `PRE_${t.nomeTest}_Q${i + 1}`,
        key: `pre_${t.nomeTest}_Q${i + 1}`,
        width: 25
      });
      columns.push({
      header: `Reaction time PRE_${t.nomeTest}_Q${i + 1}`,
      key: `Reaction time pre_${t.nomeTest}_Q${i + 1}`,
      width: 30
    });
  });

    // RISULTATO TOTALE TEST
  columns.push({
    header: `PRE_${t.nomeTest}_RISULTATO`,
    key: `pre_${t.nomeTest}_risultato`,
    width: 25
  });
  // MEDIA TEMPO TEST
  columns.push({
    header: `REACTION TIME MEDIO PRE_${t.nomeTest}`,
    key: `Reaction time medio pre_${t.nomeTest}`,
    width: 30
  });
});

  // Aggiungiamo colonne per i test post
  tentativiPost.forEach((t) => {
    t.domande.forEach((d, i) => {
      columns.push({
        header: `POST_${t.nomeTest}_Q${i + 1}`,
        key: `post_${t.nomeTest}_Q${i + 1}`,
        width: 25
      });
      columns.push({
      header: `Reaction time POST_${t.nomeTest}_Q${i + 1}`,
      key: `Reaction time post_${t.nomeTest}_Q${i + 1}`,
      width: 30
    });
  });
    // RISULTATO TOTALE TEST
  columns.push({
    header: `POST_${t.nomeTest}_RISULTATO`,
    key: `post_${t.nomeTest}_risultato`,
    width: 25
  });
  // MEDIA TEMPO TEST
  columns.push({
    header: `REACTION TIME MEDIO POST_${t.nomeTest}`,
    key: `Reaction time medio post_${t.nomeTest}`,
    width: 30
  });
  });

  sheet.columns = columns;


    const row = {
      codiceGioco: utente.codiceGioco,
      cognome: utente.cognome,
      nome: utente.nome,
      eta: calcolaEta(utente.dataNascita),
      sesso: utente.sesso,
      titolo: utente.titoloStudio,
      scuola: utente.scuolaFrequentata,
      diagnosi: utente.diagnosi ? utente.diagnosi.testo: '',
      note: utente.diagnosi ? utente.diagnosi.note: '',
    };

    sheet.getColumn("eta").alignment = { horizontal: "left" };


  tentativiPre.forEach(t => {

  let corrette = 0;
  let totale = (t.domande || []).length;
  let sommaRT = 0;

  (t.domande || []).forEach((d, i) => {
    const valore = d.correct ? 1 : 0;

    row[`pre_${t.nomeTest}_Q${i + 1}`] = valore;
    row[`Reaction time pre_${t.nomeTest}_Q${i + 1}`] = d.reactionTime || 0;

    corrette += valore;
    sommaRT += d.reactionTime || 0;
  });

  const mediaRT = totale > 0 ? (sommaRT / totale) : 0;

  row[`pre_${t.nomeTest}_risultato`] = `${corrette}/${totale}`;
  row[`Reaction time medio pre_${t.nomeTest}`] = mediaRT.toFixed(2);
});





  tentativiPost.forEach(t => {

  let corrette = 0;
  let totale = (t.domande || []).length;
  let sommaRT = 0;

  (t.domande || []).forEach((d, i) => {
    const valore = d.correct ? 1 : 0;

    row[`post_${t.nomeTest}_Q${i + 1}`] = valore;
    row[`Reaction time post_${t.nomeTest}_Q${i + 1}`] = d.reactionTime || 0;

    corrette += valore;
    sommaRT += d.reactionTime || 0;
  });

  const mediaRT = totale > 0 ? (sommaRT / totale) : 0;

  row[`post_${t.nomeTest}_risultato`] = `${corrette}/${totale}`;
  row[`Reaction time medio post_${t.nomeTest}`] = mediaRT.toFixed(2);
});


  sheet.addRow(row);
  

  sheet.getRow(1).font = { bold: true };

  return workbook;
};
