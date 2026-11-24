import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LeadPayload = {
  name?: unknown;
  contact?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown;
  consent?: unknown;
  turnstileToken?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
};

const getText = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const configured = () =>
  process.env.LEADS_ENABLED === "true" &&
  Boolean(
    process.env.TELEGRAM_BOT_TOKEN &&
      process.env.TELEGRAM_CHAT_ID &&
      process.env.TURNSTILE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  );

export async function POST(request: Request) {
  if (!configured()) {
    return NextResponse.json(
      { error: "Приём заявок временно недоступен." },
      { status: 503 },
    );
  }

  // Защищаем форму от отправки с посторонних сайтов.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ error: "Некорректный источник запроса." }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Неверный формат данных." }, { status: 415 });
  }

  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > 12000) {
    return NextResponse.json({ error: "Слишком большой запрос." }, { status: 413 });
  }

  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Invalid body");
    }
  } catch {
    return NextResponse.json({ error: "Некорректные данные формы." }, { status: 400 });
  }

  // Скрытое поле заполняют многие автоматические спам-боты.
  if (getText(payload.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = getText(payload.name, 100);
  const contact = getText(payload.contact, 160);
  const company = getText(payload.company, 120);
  const message = getText(payload.message, 2000);
  const token = getText(payload.turnstileToken, 2200);
  const utmSource = getText(payload.utmSource, 100);
  const utmMedium = getText(payload.utmMedium, 100);
  const utmCampaign = getText(payload.utmCampaign, 100);

  if (
    name.length < 2 ||
    contact.length < 5 ||
    message.length < 10 ||
    payload.consent !== true ||
    !token
  ) {
    return NextResponse.json(
      { error: "Проверьте поля и согласие на обработку данных." },
      { status: 400 },
    );
  }

  try {
    // Turnstile должен проверяться на сервере: одного виджета недостаточно.
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      },
    );

    if (!verification.ok) {
      throw new Error("Turnstile unavailable");
    }
    const result = (await verification.json()) as { success?: boolean; hostname?: string };
    if (!result.success || (result.hostname && result.hostname !== host.split(":")[0])) {
      return NextResponse.json(
        { error: "Проверка защиты от спама не пройдена. Повторите попытку." },
        { status: 400 },
      );
    }

    const lines = [
      "Новая заявка с сайта AI PROFI",
      "Имя: " + name,
      "Контакт: " + contact,
      "Компания: " + (company || "не указана"),
      "Задача: " + message,
      "Источник: " + (utmSource || "не указан"),
      "Канал: " + (utmMedium || "не указан"),
      "Кампания: " + (utmCampaign || "не указана"),
      "Время: " + new Date().toISOString(),
    ];

    const sent = await fetch(
      "https://api.telegram.org/bot" + process.env.TELEGRAM_BOT_TOKEN + "/sendMessage",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: lines.join("\n"),
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(9000),
        cache: "no-store",
      },
    );
    const reply = (await sent.json()) as { ok?: boolean };
    if (!sent.ok || !reply.ok) {
      throw new Error("Telegram delivery failed");
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    // Не подтверждаем приём, если отправка сообщения не состоялась.
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Повторите попытку позднее." },
      { status: 502 },
    );
  }
}
