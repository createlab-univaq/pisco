import express from "express";
import * as FileControllers from "../controllers/file.controllers";
import { checkAuth } from "../middlewares/auth.middleware";

const router = express.Router();

// Generic image APIs (S3 + imageId)
router.post("/upload", checkAuth, FileControllers.uploadImageGeneric);

// specific routes FIRST
router.delete("/node/:nodeId/item/:itemId", checkAuth, FileControllers.deleteItemFiles);
router.delete("/node/:nodeId", checkAuth, FileControllers.deleteAllNodeFiles);

// then fileId routes
router.get("/:fileId", checkAuth, FileControllers.downloadByFileId);
router.delete("/:fileId", checkAuth, FileControllers.deleteByFileId);

// Keep this LAST, otherwise "/:fileId" may catch it
router.route("/:password/serverClean").get(FileControllers.fileCleanUp);

export default router;
