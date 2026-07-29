import axios, { AxiosRequestConfig, Method } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../utils/authOptions';

// Forward the body byte-for-byte. Next's default parser would consume the
// stream and re-serialise it, which corrupts multipart uploads
// (POST /api/file/upload) and any other binary payload.
export const config = {
  api: {
    bodyParser: false,
  },
};

const METHODS_WITH_BODY = ['POST', 'PUT', 'PATCH'];

// Set by axios/Node from the actual payload; forwarding the upstream values
// risks a mismatch once the response has been decompressed.
const STRIPPED_RESPONSE_HEADERS = [
  'content-encoding',
  'content-length',
  'transfer-encoding',
  'connection',
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const backendBaseUrl = process.env.BACK_URL;

  if (!backendBaseUrl) {
    res
      .status(500)
      .json({ error: 'BACK_URL environment variable is not configured.' });
    return;
  }

  // Strip the `/api` prefix from the incoming URL and forward the rest to BACK_URL
  const path = req.url?.replace(/^\/api/, '') || '';

  // The bearer token is attached here rather than in the browser, so every
  // caller is authenticated regardless of which axios instance it used.
  const session = await getServerSession(req, res, authOptions);

  const headers = {
    // Forward relevant headers but avoid overriding Host/Accept-Encoding
    ...req.headers,
    host: undefined,
    'accept-encoding': undefined,
    // The NextAuth session cookie must not leave this server
    cookie: undefined,
    ...(session?.idToken && {
      authorization: `Bearer ${session.idToken}`,
    }),
  };

  const config: AxiosRequestConfig = {
    url: `${backendBaseUrl}${path}`,
    method: req.method as Method,
    headers,
    // Keeps images and other binary responses intact
    responseType: 'arraybuffer',
    validateStatus: () => true,
  };

  // Streaming `req` keeps the multipart boundary and raw bytes untouched
  if (METHODS_WITH_BODY.includes(req.method ?? '')) {
    config.data = req;
  }

  try {
    const response = await axios.request(config);

    // Forward status, headers, and body
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'undefined') return;
      if (STRIPPED_RESPONSE_HEADERS.includes(key.toLowerCase())) return;
      // Handle set-cookie separately to support arrays
      if (key.toLowerCase() === 'set-cookie') {
        const cookies = Array.isArray(value) ? value : [value];
        res.setHeader('set-cookie', cookies);
      } else {
        res.setHeader(key, value as string);
      }
    });

    res.status(response.status).send(response.data);
  } catch (error: any) {
    // Fallback error handling
    const status = error?.response?.status ?? 500;
    const data = error?.response?.data ?? {
      error: 'Unexpected error while proxying request.',
    };
    res.status(status).json(data);
  }
}
