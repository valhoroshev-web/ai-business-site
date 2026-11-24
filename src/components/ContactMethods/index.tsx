"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Channel = "telegram" | "email";
type Challenge = { question: string; token: string };
type Reveal = { url: string; address: string };

const channels = [
  { key: "telegram" as const, label: "Telegram", caption: "Перейти в чат после проверки" },
  { key: "email" as const, label: "Электронная почта", caption: "Открыть адрес после проверки" },
];

function ChannelIcon({ channel }: { channel: Channel }) {
  if (channel === "telegram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.5 2.5-5 19-5.3-6-3.5 2.4.7-5.6 13.1-9.8L3 10.7l8.2 4.8" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export default function ContactMethods() {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState<Reveal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const activeRequest = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLInputElement>(null);

  async function loadChallenge(selected: Channel) {
    const id = ++activeRequest.current;
    setChannel(selected);
    setChallenge(null);
    setAnswer("");
    setRevealed(null);
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/contact-reveal?channel=" + selected, { cache: "no-store" });
      const data = (await response.json()) as { question?: string; token?: string; error?: string };
      if (!response.ok || !data.question || !data.token) throw new Error(data.error || "Не удалось загрузить проверку.");
      if (activeRequest.current === id) setChallenge({ question: data.question, token: data.token });
    } catch (err) {
      if (activeRequest.current === id) setError(err instanceof Error ? err.message : "Ошибка загрузки.");
    } finally {
      if (activeRequest.current === id) setLoading(false);
    }
  }

  function close() {
    activeRequest.current += 1;
    setChannel(null);
    setChallenge(null);
    setRevealed(null);
    setError("");
  }

  useEffect(() => {
    if (channel) {
      dialogRef.current?.focus();
      if (challenge) answerRef.current?.focus();
    }
  }, [channel, challenge]);

  useEffect(() => {
    if (!channel) return;
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [channel]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge || !channel || !answer.trim() || loading) return;
    const id = ++activeRequest.current;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/contact-reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ channel, answer, token: challenge.token }),
      });
      const data = (await response.json()) as { url?: string; address?: string; error?: string };
      if (!response.ok || !data.url || !data.address) throw new Error(data.error || "Проверка не пройдена.");
      if (activeRequest.current === id) setRevealed({ url: data.url, address: data.address });
    } catch (err) {
      if (activeRequest.current === id) setError(err instanceof Error ? err.message : "Проверка не пройдена.");
    } finally {
      if (activeRequest.current === id) setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {channels.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => void loadChallenge(item.key)}
            className="group flex items-center gap-5 rounded-2xl border border-white/20 bg-white p-6 text-left text-black transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg dark:bg-[#242c3a] dark:text-white"
            aria-label={"Открыть " + item.label + " после проверки"}
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/20">
              <ChannelIcon channel={item.key} />
            </span>
            <span>
              <span className="block text-lg font-bold">{item.label}</span>
              <span className="mt-2 block text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.caption}</span>
            </span>
          </button>
        ))}
      </div>

      {channel && (
        <div role="dialog" aria-modal="true" aria-label={"Проверка для " + (channel === "telegram" ? "Telegram" : "электронной почты")} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={close}>
          <div ref={dialogRef} tabIndex={-1} className="w-full max-w-md rounded-2xl bg-white p-6 text-left text-black shadow-2xl outline-none dark:bg-[#242c3a] dark:text-white sm:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{channel === "telegram" ? "Открыть Telegram" : "Связаться по почте"}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Пройдите простую проверку, чтобы открыть контакт.</p>
              </div>
              <button type="button" onClick={close} aria-label="Закрыть" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10">✕</button>
            </div>

            {revealed ? (
              <div role="status" className="space-y-4">
                <p className="font-semibold text-green-700 dark:text-green-400">Проверка пройдена</p>
                {channel === "email" && (
                  <p className="break-all text-sm">Адрес: <span className="font-semibold">{revealed.address}</span></p>
                )}
                <a href={revealed.url} target={channel === "telegram" ? "_blank" : undefined} rel={channel === "telegram" ? "noopener noreferrer" : undefined} className="inline-flex w-full justify-center rounded-lg bg-primary px-6 py-4 font-semibold text-white hover:bg-primary/90">
                  {channel === "telegram" ? "Перейти в Telegram" : "Написать письмо"}
                </a>
                {channel === "email" && <p className="text-xs text-gray-600 dark:text-gray-300">Откроется установленное почтовое приложение.</p>}
              </div>
            ) : (
              <form onSubmit={(event) => void submit(event)} className="space-y-4">
                {challenge ? (
                  <>
                    <label htmlFor="contact-captcha-answer" className="block text-base font-semibold">{challenge.question}</label>
                    <input
                      id="contact-captcha-answer"
                      ref={answerRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                      required
                      maxLength={2}
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="Введите ответ"
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 text-black outline-none focus:border-primary dark:border-white/30 dark:bg-[#171c28] dark:text-white"
                    />
                  </>
                ) : loading ? (
                  <p role="status" className="text-sm text-gray-600 dark:text-gray-300">Загружаем проверку…</p>
                ) : null}
                {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                <button disabled={!challenge || loading || !answer} type="submit" className="w-full rounded-lg bg-primary px-6 py-4 font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
                  {loading ? "Проверяем…" : "Открыть контакт"}
                </button>
                <button type="button" disabled={loading} onClick={() => void loadChallenge(channel)} className="w-full py-2 text-sm font-semibold text-primary hover:underline disabled:opacity-50">Другой вопрос</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
