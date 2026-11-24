"use client";

import Script from "next/script";
import { FormEvent, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: { reset: (widgetId?: string) => void };
    ym?: (id: number, action: string, goal?: string) => void;
  }
}

type Props = {
  enabled: boolean;
  siteKey?: string;
  metrikaId?: string;
};

export default function LeadForm({ enabled, siteKey, metrikaId }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !enabled || !formRef.current) return;

    const form = new FormData(formRef.current);
    const token = form.get("cf-turnstile-response")?.toString() || "";
    if (!token) {
      setError("Подтвердите, что вы не робот.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const params = new URLSearchParams(window.location.search);
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          contact: form.get("contact"),
          company: form.get("company"),
          message: form.get("message"),
          website: form.get("website"),
          consent: form.get("consent") === "on",
          turnstileToken: token,
          utmSource: params.get("utm_source") || sessionStorage.getItem("utm_source") || "",
          utmMedium: params.get("utm_medium") || sessionStorage.getItem("utm_medium") || "",
          utmCampaign: params.get("utm_campaign") || sessionStorage.getItem("utm_campaign") || "",
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Не удалось отправить заявку.");
      }
      setSuccess(true);
      formRef.current.reset();
      const id = Number(metrikaId);
      if (Number.isInteger(id) && id > 0 && typeof window.ym === "function") {
        window.ym(id, "reachGoal", "lead_submitted");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки заявки.");
      window.turnstile?.reset();
    } finally {
      setSending(false);
    }
  }

  if (!enabled || !siteKey) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/5 p-7 text-left text-[#d4dcef]">
        <p className="mb-2 font-semibold text-white">Приём заявок подключается</p>
        <p className="text-sm leading-relaxed">
          Форма будет активирована после настройки канала уведомлений,
          защиты от спама и юридических документов. Пока персональные данные не собираются.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div role="status" className="rounded-2xl border border-[#7adabb]/50 bg-[#144d47] p-7 text-left text-white">
        <h3 className="mb-2 text-xl font-bold">Заявка отправлена</h3>
        <p className="text-sm leading-relaxed">Ваш запрос передан на рассмотрение. Благодарим за обращение.</p>
        <button type="button" className="mt-5 text-sm font-semibold underline" onClick={() => { setSuccess(false); window.turnstile?.reset(); }}>
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-white p-6 text-left text-black shadow-xl dark:bg-gray-dark dark:text-white sm:p-8">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
      <h3 className="mb-6 text-xl font-bold">Обсудить автоматизацию</h3>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Имя *
            <input name="name" type="text" autoComplete="name" maxLength={100} minLength={2} required placeholder="Как к вам обращаться" className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none focus:border-primary dark:bg-[#252c3b] dark:text-white" />
          </label>
          <label className="block text-sm font-medium">
            Контакт *
            <input name="contact" type="text" maxLength={160} minLength={5} required placeholder="Телефон, email или Telegram" className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none focus:border-primary dark:bg-[#252c3b] dark:text-white" />
          </label>
        </div>
        <label className="block text-sm font-medium">
          Компания
          <input name="company" type="text" maxLength={120} placeholder="Название компании (необязательно)" className="mt-2 w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none focus:border-primary dark:bg-[#252c3b] dark:text-white" />
        </label>
        <label className="block text-sm font-medium">
          Что хотите автоматизировать? *
          <textarea name="message" minLength={10} maxLength={2000} required rows={4} placeholder="Опишите процесс, сервисы и текущую задачу" className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-white p-3 text-black outline-none focus:border-primary dark:bg-[#252c3b] dark:text-white" />
        </label>
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Сайт <input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <input type="checkbox" name="consent" required className="mt-1 accent-primary" />
          <span>Согласен(на) на обработку указанных данных для ответа на обращение согласно <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">политике конфиденциальности</a>.</span>
        </label>
        <div className="cf-turnstile" data-sitekey={siteKey} data-theme="auto" />
        {error && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
        <button disabled={sending} type="submit" className="w-full rounded-lg bg-primary px-6 py-4 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60">
          {sending ? "Отправляем..." : "Отправить заявку"}
        </button>
        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">Без обещаний фиксированной цены или результата до анализа задачи.</p>
      </form>
    </div>
  );
}
