import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const SESSION_COOKIE_NAME = 'session';

export interface SessionUser {
  id: string;
  username: string;
  isAdmin: boolean;
}

export interface SessionPayload {
  user: SessionUser;
  expiresAt: Date;
}

/**
 * Create a new session for a user (10 years expiration)
 */
export async function createSession(user: SessionUser) {
  const expiresAt = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000); // 10 years

  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresAt)
    .sign(secret);

  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Get the current session
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

/**
 * Delete the current session
 */
export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}