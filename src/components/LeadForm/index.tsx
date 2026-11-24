"use client";

import Script from "next/script";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

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

type IconChallenge = {
  prompt: string;
  options: { id: string; glyph: string; label: string }[];
  token: string;
};

export default function LeadForm({ enabled, siteKey, metrikaId }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [iconChallenge, setIconChallenge] = useState<IconChallenge | null>(null);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [iconLoading, setIconLoading] = useState(false);
  const [iconError, setIconError] = useState("");

  const refreshIconChallenge = useCallback(async () => {
    setIconLoading(true);
    setSelectedIcon("");
    setIconError("");
    setIconChallenge(null);

    try {
      const response = await fetch("/api/icon-captcha", { cache: "no-store" });
      if (!response.ok) throw new Error("Иконки временно недоступны.");
      const data = (await response.json()) as IconChallenge;
      if (!data.prompt || data.options?.length !== 4 || !data.token) {
        throw new Error("Некорректный набор иконок.");
      }
      setIconChallenge(data);
    } catch {
      setIconError("Не удалось загрузить иконки. Нажмите «Другие иконки».");
    } finally {
      setIconLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled && siteKey) {
      void refreshIconChallenge();
    }
  }, [enabled, siteKey, refreshIconChallenge]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !enabled || !formRef.current) return;
    if (!iconChallenge || !selectedIcon) {
      setError("Выберите нужную иконку для проверки.");
      return;
    }

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
          iconCaptchaToken: iconChallenge.token,
          iconCaptchaAnswer: selectedIcon,
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
      setSelectedIcon("");
      formRef.current?.reset();
      const id = Number(metrikaId);
      if (Number.isInteger(id) && id > 0 && typeof window.ym === "function") {
        window.ym(id, "reachGoal", "lead_submitted");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки заявки.");
      window.turnstile?.reset();
      void refreshIconChallenge();
    } finally {
      setSending(false);
    }
  }

  if (!enabled || !siteKey) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white p-6 text-left text-black shadow-xl dark:bg-gray-dark dark:text-white sm:p-8">
        <h3 className="mb-3 text-xl font-bold">Форма заявки</h3>
        <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300" role="status">
          Форма готовится к подключению. Отправка пока отключена — воспользуйтесь
          Telegram или электронной почтой выше. Поля ниже показаны для ознакомления,
          данные не собираются.
        </p>
        <fieldset disabled className="space-y-4 opacity-60" aria-label="Предварительный вид формы: отправка отключена">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Имя
              <input type="text" placeholder="Как к вам обращаться" className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-black dark:bg-[#252c3b] dark:text-white" />
            </label>
            <label className="block text-sm font-medium">
              Контакт
              <input type="text" placeholder="Телефон, email или Telegram" className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-black dark:bg-[#252c3b] dark:text-white" />
            </label>
          </div>
          <label className="block text-sm font-medium">
            Компания
            <input type="text" placeholder="Необязательно" className="mt-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-black dark:bg-[#252c3b] dark:text-white" />
          </label>
          <label className="block text-sm font-medium">
            Что хотите автоматизировать?
            <textarea rows={3} placeholder="Опишите задачу и используемые сервисы" className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-gray-50 p-3 text-black dark:bg-[#252c3b] dark:text-white" />
          </label>
          <div className="rounded-xl border border-gray-300 p-4 dark:border-white/20">
            <p className="mb-3 text-sm font-semibold">Проверка по иконкам · пример</p>
            <p className="mb-3 text-sm">Нажмите на иконку «Ключ»</p>
            <div className="flex flex-wrap gap-3">
              {["🔒", "🔑", "⚙️", "⭐"].map((glyph) => (
                <span key={glyph} className="flex h-14 w-14 items-center justify-center rounded-lg border border-gray-300 text-3xl dark:border-white/20" aria-hidden="true">{glyph}</span>
              ))}
            </div>
          </div>
          <button type="button" className="w-full rounded-lg bg-primary px-6 py-4 font-semibold text-white">
            Отправка пока недоступна
          </button>
        </fieldset>
      </div>
    );
  }

  if (success) {
    return (
      <div role="status" className="rounded-2xl border border-[#7adabb]/50 bg-[#144d47] p-7 text-left text-white">
        <h3 className="mb-2 text-xl font-bold">Заявка передана</h3>
        <p className="text-sm leading-relaxed">Запрос передан в сервис доставки. Если ответа нет, напишите нам напрямую в Telegram или на почту.</p>
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
        <fieldset className="rounded-xl border border-gray-300 p-4 dark:border-white/20">
          <legend className="px-2 text-sm font-bold">Проверка по иконкам</legend>
          {iconLoading ? (
            <p role="status" className="text-sm text-gray-600 dark:text-gray-300">Загружаем иконки…</p>
          ) : iconChallenge ? (
            <>
              <p className="mb-4 text-sm font-semibold">{iconChallenge.prompt}</p>
              <div role="group" aria-label="Выберите правильную иконку" className="flex flex-wrap gap-3">
                {iconChallenge.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setSelectedIcon(option.id);
                      setError("");
                    }}
                    aria-label={option.label}
                    aria-pressed={selectedIcon === option.id}
                    className={
                      "flex h-16 w-16 items-center justify-center rounded-xl border-2 text-3xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary " +
                      (selectedIcon === option.id
                        ? "border-primary bg-primary/10"
                        : "border-gray-300 hover:border-primary dark:border-white/20")
                    }
                  >
                    {option.glyph}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Выбранный значок подсвечивается. Набор действует несколько минут.
              </p>
            </>
          ) : (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">{iconError}</p>
          )}
          <button
            type="button"
            onClick={() => void refreshIconChallenge()}
            disabled={iconLoading}
            className="mt-4 text-sm font-semibold text-primary hover:underline disabled:opacity-50"
          >
            Другие иконки
          </button>
        </fieldset>
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
