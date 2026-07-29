import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import PolyglotFileModel from "../models/file.model";
import PolyglotFlowModel from "../models/flow.model";

const multer = require("multer");

import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../services/s3";

// --------------------
// Helpers
// --------------------
const safeName = (s: string) => s.replace(/[^a-zA-Z0-9._-]+/g, "_");
const newUuid = () =>
  (globalThis.crypto as any)?.randomUUID?.() ?? crypto.randomUUID();

interface MulterFileMem {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
type RequestWithMemFile = Request & { file?: MulterFileMem };

// Multer in-memory (NO filesystem)
const uploadMem = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// --------------------
// POST /api/file/upload
// multipart:
// - file
// - parentNodeId (required)
// - parentItemId (optional)
// response: { imageId }
// --------------------
export const uploadImageGeneric = [
  uploadMem.single("file"),
  async (req: RequestWithMemFile, res: Response) => {
    try {
      const parentNodeId =
        (req.body?.parentNodeId as string | undefined) ?? undefined;
      const parentItemId =
        (req.body?.parentItemId as string | undefined) ?? undefined;

      if (!parentNodeId) {
        return res.status(400).json({ message: "Missing parentNodeId" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato" });
      }

      const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!allowed.includes(req.file.mimetype)) {
        return res
          .status(400)
          .json({ message: "Formato non supportato (PNG/JPG/WEBP)" });
      }

      const imageId = newUuid();

      //  NUOVO: se parentItemId esiste, organizzo su S3 per item
      // - Nodo normale: polyglot/<parentNodeId>/images/...
      // - Item container: polyglot/<parentNodeId>/items/<parentItemId>/images/...
      const itemPart = parentItemId ? `/items/${parentItemId}` : "";
      const key = `polyglot/${parentNodeId}${itemPart}/images/${imageId}-${Date.now()}-${safeName(
        req.file.originalname
      )}`;

      // Upload su S3
      await s3.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );

      // Salva metadati su Mongo (path = S3 key)
      await PolyglotFileModel.findByIdAndUpdate(
        imageId,
        {
          _id: imageId,
          parentNodeId,
          ...(parentItemId ? { parentItemId } : {}),
          filename: req.file.originalname,
          path: key,
          uploadedAt: new Date(),
          contentType: req.file.mimetype,
          size: req.file.size,
        },
        { upsert: true, new: true }
      );

      return res.status(200).json({ imageId });
    } catch (err) {
      console.error("uploadImageGeneric error", err);
      return res.status(500).json({ message: "Errore upload immagine" });
    }
  },
];

// --------------------
// GET /api/file/:fileId
// Stream immagine dal bucket
// --------------------
export const downloadByFileId = async (req: Request, res: Response) => {
  const { fileId } = (req as any).params;

  try {
    const file = await PolyglotFileModel.findById(String(fileId));
    if (!file) return res.status(404).json({ message: "File not found" });

    const obj = await s3.send(
      new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: file.path,
      })
    );

    res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);

    const ct = (file as any).contentType || (obj as any).ContentType;
    if (ct) res.setHeader("Content-Type", ct);

    (obj.Body as any).pipe(res);
  } catch (err) {
    console.error("downloadByFileId error", err);
    return res.status(500).json({ message: "Error during download" });
  }
};

// --------------------
// DELETE /api/file/:fileId
// Cancella oggetto S3 + record Mongo
// --------------------
export const deleteByFileId = async (req: Request, res: Response) => {
  const { fileId } = (req as any).params;

  try {
    const file = await PolyglotFileModel.findById(String(fileId));
    if (!file) return res.status(204).send();

    await s3.send(
      new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: file.path,
      })
    );

    await PolyglotFileModel.deleteOne({ _id: String(fileId) });

    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteByFileId error", err);
    return res.status(500).json({ message: "Error during delete" });
  }
};

// --------------------
// DELETE /api/file/node/:nodeId
// Cancella tutti i file associati al nodo (S3 + Mongo)
// --------------------
export const deleteAllNodeFiles = async (req: Request, res: Response) => {
  const { nodeId } = (req as any).params;

  try {
    const files = await PolyglotFileModel.find({ parentNodeId: String(nodeId) });

    await Promise.allSettled(
      files.map((f: any) =>
        s3.send(
          new DeleteObjectCommand({
            Bucket: S3_BUCKET,
            Key: f.path,
          })
        )
      )
    );

    const resp = await PolyglotFileModel.deleteMany({
      parentNodeId: String(nodeId),
    });

    return res.status(200).json({
      message: "Node files deleted (or none existed)",
      deletedCount: resp.deletedCount ?? 0,
    });
  } catch (err) {
    console.error("deleteAllNodeFiles error", err);
    return res.status(500).json({ message: "Error during deleteAllNodeFiles" });
  }
};

// --------------------
// DELETE /api/file/node/:nodeId/item/:itemId
// Cancella tutti i file associati a un item (S3 + Mongo)
// --------------------
export const deleteItemFiles = async (req: Request, res: Response) => {
  const { nodeId, itemId } = (req as any).params;

  try {
    const files = await PolyglotFileModel.find({
      parentNodeId: String(nodeId),
      parentItemId: String(itemId),
    });

    await Promise.allSettled(
      files.map((f: any) =>
        s3.send(
          new DeleteObjectCommand({
            Bucket: S3_BUCKET,
            Key: f.path,
          })
        )
      )
    );

    const resp = await PolyglotFileModel.deleteMany({
      parentNodeId: String(nodeId),
      parentItemId: String(itemId),
    });

    return res.status(200).json({
      message: "Item files deleted (or none existed)",
      deletedCount: resp.deletedCount ?? 0,
    });
  } catch (err) {
    console.error("deleteItemFiles error", err);
    return res.status(500).json({ message: "Error during deleteItemFiles" });
  }
};

// --------------------
// GET /api/file/:password/serverClean
// Ora pulisce DB + S3 per evitare oggetti fantasma.
// Regola: se parentNodeId non è tra i node._id dei flow -> file da rimuovere.
// --------------------
export async function fileCleanUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.params.password !== "polyglotClean") throw "Wrong password";

    const files = await PolyglotFileModel.find();
    const flows = await PolyglotFlowModel.find();

    const validNodeIds = flows.flatMap((flow: any) =>
      flow.nodes.map((node: any) => String(node._id))
    );

    const filesToRemove = files.filter((file: any) => {
      const parent = file.parentNodeId ? String(file.parentNodeId) : null;
      return parent ? !validNodeIds.includes(parent) : true;
    });

    if (filesToRemove.length === 0) {
      return res.status(200).json("Nessun file da rimuovere.");
    }

    // 1) Provo a cancellare su S3 usando le key salvate nel DB
    await Promise.allSettled(
      filesToRemove.map((f: any) =>
        s3.send(
          new DeleteObjectCommand({
            Bucket: S3_BUCKET,
            Key: f.path,
          })
        )
      )
    );

    // 2) Cancello i record su Mongo
    const resp = await PolyglotFileModel.deleteMany({
      _id: { $in: filesToRemove.map((f: any) => String(f._id)) },
    });

    console.log(
      `Rimossi ${resp.deletedCount} file non associati a nodi validi (S3 + DB).`
    );

    return res
      .status(200)
      .json(
        `Rimossi ${resp.deletedCount} file non associati a nodi validi (S3 + DB).`
      );
  } catch (error) {
    next(error);
  }
}


