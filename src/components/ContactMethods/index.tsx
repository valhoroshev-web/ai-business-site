export default function ContactMethods() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <a
        href="https://t.me/valeryhor"
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-2xl border border-white/20 bg-white p-6 text-left text-black transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg dark:bg-[#242c3a] dark:text-white"
        aria-label="Написать AI PROFI в Telegram: @valeryhor"
      >
        <span className="mb-2 block text-sm font-semibold uppercase tracking-widest text-primary">Telegram</span>
        <span className="block break-all text-xl font-bold">@valeryhor</span>
        <span className="mt-3 block text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Открыть чат и описать задачу
          <span aria-hidden="true"> →</span>
        </span>
      </a>
      <a
        href="mailto:valhoroshev@gmail.com?subject=AI%20PROFI%20%E2%80%94%20%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%20%D0%BD%D0%B0%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8E"
        className="group rounded-2xl border border-white/20 bg-white p-6 text-left text-black transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg dark:bg-[#242c3a] dark:text-white"
        aria-label="Написать AI PROFI на электронную почту valhoroshev@gmail.com"
      >
        <span className="mb-2 block text-sm font-semibold uppercase tracking-widest text-primary">Электронная почта</span>
        <span className="block break-all text-lg font-bold sm:text-xl">valhoroshev@gmail.com</span>
        <span className="mt-3 block text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Открыть письмо с темой обращения
          <span aria-hidden="true"> →</span>
        </span>
      </a>
    </div>
  );
}
