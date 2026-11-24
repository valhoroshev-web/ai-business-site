import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Channel = "telegram" | "email";
const lifetimeMs = 5 * 60 * 1000;

const headers = { "Cache-Control": "private, no-store, max-age=0" };

function getChannel(value: unknown): Channel | null {
  return value === "telegram" || value === "email" ? value : null;
}

function getDestination(channel: Channel): { url: string; address: string } | null {
  if (channel === "telegram") {
    const username = (process.env.CONTACT_TELEGRAM_USERNAME || "").trim().replace(/^@/, "");
    if (!/^[a-zA-Z0-9_]{5,32}$/.test(username)) return null;
    return { url: "https://t.me/" + username, address: "@" + username };
  }
  const email = (process.env.CONTACT_EMAIL || "").trim();
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return null;
  return { url: "mailto:" + email + "?subject=" + encodeURIComponent("Запрос с сайта AI PROFI"), address: email };
}

function signature(nonce: string, expiresAt: string, channel: Channel, answer: string, secret: string) {
  return createHmac("sha256", secret)
    .update(["ai-profi-contact-v1", nonce, expiresAt, channel, answer].join(":"))
    .digest("hex");
}

function unavailable() {
  return NextResponse.json({ error: "Способ связи пока настраивается." }, { status: 503, headers });
}

export function GET(request: NextRequest) {
  const channel = getChannel(request.nextUrl.searchParams.get("channel"));
  if (!channel) return NextResponse.json({ error: "Неизвестный канал." }, { status: 400, headers });
  const secret = process.env.CONTACT_CAPTCHA_SECRET;
  if (!secret || secret.length < 24 || !getDestination(channel)) return unavailable();

  const a = randomInt(2, 10);
  const b = randomInt(2, 10);
  const nonce = randomBytes(16).toString("hex");
  const expiresAt = String(Date.now() + lifetimeMs);
  const digest = signature(nonce, expiresAt, channel, String(a + b), secret);
  return NextResponse.json({
    question: "Сколько будет " + a + " + " + b + "?",
    token: [nonce, expiresAt, digest].join("."),
  }, { headers });
}

export async function POST(request: NextRequest) {
  const secret = process.env.CONTACT_CAPTCHA_SECRET;
  if (!secret || secret.length < 24) return unavailable();

  // Do not expose a contact to scripts making cross-origin browser requests.
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Неверный источник запроса." }, { status: 403, headers });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Неверный формат запроса." }, { status: 415, headers });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Неверные данные." }, { status: 400, headers });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Неверные данные." }, { status: 400, headers });
  }
  const input = payload as Record<string, unknown>;
  const channel = getChannel(input.channel);
  const answer = typeof input.answer === "string" ? input.answer.trim() : "";
  const token = typeof input.token === "string" ? input.token : "";
  const match = /^([a-f0-9]{32})\.([0-9]{13})\.([a-f0-9]{64})$/.exec(token);

  if (!channel || !/^\d{1,2}$/.test(answer) || !match) {
    return NextResponse.json({ error: "Проверьте ответ и повторите попытку." }, { status: 400, headers });
  }

  const [, nonce, expiresAt, receivedHex] = match;
  const remaining = Number(expiresAt) - Date.now();
  if (remaining <= 0 || remaining > lifetimeMs) {
    return NextResponse.json({ error: "Время проверки истекло. Обновите вопрос." }, { status: 400, headers });
  }

  const expectedHex = signature(nonce, expiresAt, channel, String(Number(answer)), secret);
  if (!timingSafeEqual(Buffer.from(receivedHex, "hex"), Buffer.from(expectedHex, "hex"))) {
    return NextResponse.json({ error: "Неверный ответ. Попробуйте ещё раз." }, { status: 400, headers });
  }

  const destination = getDestination(channel);
  if (!destination) return unavailable();
  return NextResponse.json(destination, { headers });
}
