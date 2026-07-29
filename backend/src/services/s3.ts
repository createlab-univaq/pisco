import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// Export the S3/MinIO client instance named 's3'
export const s3 = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
  forcePathStyle: true, // Crucial for MinIO!
});

// Export the bucket name variable named 'S3_BUCKET'
export const S3_BUCKET = process.env.S3_BUCKET || "polyglot-uploads-dev";