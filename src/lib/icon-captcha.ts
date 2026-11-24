import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

const icons = [
  { id: "key", glyph: "🔑", label: "Ключ" },
  { id: "lock", glyph: "🔒", label: "Замок" },
  { id: "gear", glyph: "⚙️", label: "Шестерёнка" },
  { id: "bell", glyph: "🔔", label: "Колокольчик" },
  { id: "star", glyph: "⭐", label: "Звезда" },
  { id: "rocket", glyph: "🚀", label: "Ракета" },
  { id: "book", glyph: "📘", label: "Книга" },
  { id: "clock", glyph: "🕒", label: "Часы" },
] as const;

const challengeLifetimeMs = 5 * 60 * 1000;
const protocol = "ai-profi-icon-captcha-v1";

export type IconChallenge = {
  prompt: string;
  options: { id: string; glyph: string; label: string }[];
  token: string;
};

function sign(nonce: string, expires: number, answerId: string, secret: string) {
  return createHmac("sha256", secret)
    .update([protocol, nonce, expires, answerId].join(":"))
    .digest("hex");
}

export function createIconChallenge(): IconChallenge {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("Captcha is not configured");

  // Cryptographically shuffle the choices on every request.
  const shuffled = [...icons];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const options = shuffled.slice(0, 4);
  const target = options[randomInt(options.length)];
  const nonce = randomBytes(16).toString("hex");
  const expires = Date.now() + challengeLifetimeMs;
  const digest = sign(nonce, expires, target.id, secret);

  // The correct choice is not encoded in the token or page source.
  return {
    prompt: "Нажмите на иконку «" + target.label + "»",
    options,
    token: [nonce, expires, digest].join("."),
  };
}

export function verifyIconAnswer(token: string, answerId: string): boolean {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !icons.some((icon) => icon.id === answerId)) return false;

  const match = /^([a-f0-9]{32})\.([0-9]{13})\.([a-f0-9]{64})$/.exec(token);
  if (!match) return false;

  const [, nonce, expiresText, suppliedDigest] = match;
  const expires = Number(expiresText);
  const remaining = expires - Date.now();
  if (remaining <= 0 || remaining > challengeLifetimeMs) return false;

  const expectedDigest = sign(nonce, expires, answerId, secret);
  return timingSafeEqual(Buffer.from(suppliedDigest, "hex"), Buffer.from(expectedDigest, "hex"));
}
