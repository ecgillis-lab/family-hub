import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import { cookies } from "next/headers";

const COOKIE = "fh_session";

function secret(): string {
  return process.env.SESSION_SECRET || "family-hub-local-secret";
}

export function hashPin(pin: string): { salt: string; hash: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 32).toString("hex");
  return { salt, hash };
}

export function verifyPin(pin: string, salt: string, hash: string): boolean {
  const check = scryptSync(pin, salt, 32);
  const real = Buffer.from(hash, "hex");
  if (check.length !== real.length) return false;
  return timingSafeEqual(check, real);
}

export function signSession(): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
  const payload = `ok.${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ok, exp, sig] = parts;
  if (ok !== "ok") return false;
  const payload = `${ok}.${exp}`;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  try {
    if (
      !timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(sig, "utf8"))
    ) {
      return false;
    }
  } catch {
    return false;
  }
  return Number(exp) > Date.now();
}

export async function getSession(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value);
}

export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, signSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export function isValidPin(pin: string): boolean {
  return /^\d{4,6}$/.test(pin);
}
