export interface PolyglotFileInfo {
  _id: string;           // imageId
  parentNodeId: string;  // nodo padre
  parentItemId?: string; // nodo child del container 
  filename: string;
  path: string;          // S3 key
  contentType?: string;
  size?: number;
  uploadedAt?: Date;
}

