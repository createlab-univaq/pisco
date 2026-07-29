const express = require("express");
const router = express.Router();

const excelController = require("../controllers/excel.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/export/excel/:utenteId",
  authMiddleware,
  excelController.exportExcel,
);
module.exports = router;
