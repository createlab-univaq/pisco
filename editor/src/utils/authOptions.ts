import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// Refresh a minute early so a token is never spent mid-request
const EXPIRY_MARGIN_MS = 60_000;

/**
 * The backend verifies Google ID tokens, so the ID token is what we have to
 * keep alive — not the access token. Its lifetime is read from its own `exp`
 * claim rather than from `account.expires_at`, which describes the access
 * token instead.
 */
const idTokenExpiry = (idToken?: string): number => {
  const payload = idToken?.split('.')[1];
  if (!payload) return 0;

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    return typeof claims.exp === 'number' ? claims.exp * 1000 : 0;
  } catch {
    return 0;
  }
};

const refreshIdToken = async (token: JWT): Promise<JWT> => {
  if (!token.refreshToken) return { ...token, error: 'MissingRefreshToken' };

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshed = await response.json();
    if (!response.ok) throw refreshed;

    return {
      ...token,
      idToken: refreshed.id_token ?? token.idToken,
      idTokenExpires: idTokenExpiry(refreshed.id_token) || token.idTokenExpires,
      // Google only returns a new refresh token when it rotates one
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch {
    return { ...token, error: 'RefreshIdTokenError' };
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'openid email profile',
          // Both are required for Google to hand back a refresh token
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      // Initial sign-in: `account` is only populated once
      if (account) {
        return {
          ...token,
          idToken: account.id_token,
          refreshToken: account.refresh_token,
          idTokenExpires: idTokenExpiry(account.id_token),
        };
      }

      if (Date.now() < (token.idTokenExpires ?? 0) - EXPIRY_MARGIN_MS) {
        return token;
      }

      return refreshIdToken(token);
    },
    async session({ session, token }) {
      session.idToken = token.idToken;
      session.error = token.error;
      return session;
    },
  },
};
