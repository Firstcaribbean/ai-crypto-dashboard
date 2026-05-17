import { cookies } from "next/headers";

export const SESSION_COOKIE = "neura_admin_session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "local-neuratrade-session-secret";
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "changeme123"
  };
}

async function hmac(value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(username: string) {
  const payload = `${username}:${Math.floor(Date.now() / 1000)}`;
  const signature = await hmac(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token?: string) {
  if (!token) return false;
  const [username, timestamp, signature] = token.split(/[.:]/);
  if (!username || !timestamp || !signature) return false;

  const payload = `${username}:${timestamp}`;
  const expected = await hmac(payload);
  const ageSeconds = Math.floor(Date.now() / 1000) - Number(timestamp);

  return signature === expected && ageSeconds >= 0 && ageSeconds < 60 * 60 * 24 * 7;
}

export async function isAdminAuthenticated() {
  return verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
}
