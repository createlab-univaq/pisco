const excelService = require("../services/excelService");
const Utente = require("../models/utente");
const TentativoTest = require("../models/tentativoTest");

exports.exportExcel = async (req, res) => {
  try {
    const { utenteId } = req.params;

    console.log("utenteId:", utenteId);


    const utente = await Utente.findOne({
      _id: utenteId,
      analistaId: req.user.id,
    });
    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    const tentativi = await TentativoTest.find({ utenteId });

    const workbook = await excelService.createExcel(utente, tentativi);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="report_${utente.nome}.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore export Excel" });
  }
};
