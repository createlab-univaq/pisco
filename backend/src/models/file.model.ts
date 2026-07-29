import mongoose, { Model } from "mongoose";
import { PolyglotFileInfo } from "../types/PolyglotFile";

const fileSchema = new mongoose.Schema<PolyglotFileInfo>({
  // imageId (UUID)
  _id: {
    type: String,
    required: true,
  },

  // Nodo "reale" del flow a cui il file è associato (usato per cleanup)
  parentNodeId: {
    type: String,
    required: true,
    index: true,
  },

  // Item figlio opzionale (es. nodo dentro container)
  // NON usato per cleanup globale, ma per gestione fine (delete item)
  parentItemId: {
    type: String,
    required: false,
    index: true,
  },

  // Nome originale del file (per download / debug)
  filename: {
    type: String,
    required: true,
  },

  // S3 key (es: polyglot/<parentNodeId>/images/<imageId>-xxx.png)
  path: {
    type: String,
    required: true,
  },

  // Metadata utili
  contentType: {
    type: String,
    required: false,
  },

  size: {
    type: Number,
    required: false,
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indice composto utile per cancellare rapidamente i file di un item
fileSchema.index({ parentNodeId: 1, parentItemId: 1 });

export interface PolyglotFileModel extends Model<PolyglotFileInfo> {}

export default mongoose.model<PolyglotFileInfo, PolyglotFileModel>(
  "File",
  fileSchema
);
