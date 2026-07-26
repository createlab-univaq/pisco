import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';

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

  const config: AxiosRequestConfig = {
    url: `${backendBaseUrl}${path}`,
    method: req.method,
    // Forward body and query params
    data: req.body,
    headers: {
      // Forward relevant headers but avoid overriding Host/Accept-Encoding
      ...req.headers,
      host: undefined,
      'accept-encoding': undefined,
    },
    // Allow cookies and other credentials to be forwarded
    withCredentials: true,
    validateStatus: () => true,
  };

  try {
    const response = await axios.request(config);

    // Forward status, headers, and body
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'undefined') return;
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

