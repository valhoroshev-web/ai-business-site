import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Обработка персональных данных | AI PROFI",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  const operatorName = process.env.LEGAL_OPERATOR_NAME;
  const operatorEmail = process.env.LEGAL_CONTACT_EMAIL;
  const operatorAddress = process.env.LEGAL_OPERATOR_ADDRESS;
  const complete = Boolean(operatorName && operatorEmail && operatorAddress);

  return (
    <main className="bg-white pb-24 pt-36 dark:bg-gray-dark md:pt-44">
      <div className="container max-w-4xl">
        <Link href="/" className="mb-8 inline-block text-sm font-semibold text-primary hover:underline">← На главную</Link>
        <h1 className="mb-8 text-3xl font-bold text-black dark:text-white md:text-4xl">Обработка персональных данных</h1>
        {!complete ? (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-950">
            Политика находится в подготовке. До указания оператора персональных данных
            и проверки документа приём заявок на сайте отключён.
          </div>
        ) : (
          <div className="space-y-7 leading-relaxed text-body-color dark:text-body-color-dark">
            <p>
              Оператор персональных данных: <strong className="text-black dark:text-white">{operatorName}</strong>.
              Адрес: {operatorAddress}. Для вопросов о данных: {operatorEmail}.
            </p>
            <section>
              <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">1. Какие данные собираем</h2>
              <p>При отправке заявки могут обрабатываться имя, указанный способ связи, название компании, текст обращения и технические данные, необходимые для защиты формы от спама. Источник обращения и UTM-метки используются для анализа эффективности сайта.</p>
            </section>
            <section>
              <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">2. Для чего используем</h2>
              <p>Данные используются для обработки запроса, связи с заявителем, подготовки предложения и предотвращения автоматических отправок. Аналитика Яндекс Метрики включается только после отдельного согласия посетителя.</p>
            </section>
            <section>
              <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">3. Сторонние сервисы</h2>
              <p>Для проверки запросов используется Cloudflare Turnstile. Для доставки обращений оператору предусмотрен Telegram Bot API. При активации этих сервисов необходимо отдельно проверить требования к передаче данных и применимое законодательство.</p>
            </section>
            <section>
              <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">4. Запросы и удаление</h2>
              <p>По вопросам обработки данных, исправления сведений, отзыва согласия и удаления информации можно написать на адрес: {operatorEmail}. Данные должны удаляться при прекращении оснований для их обработки в порядке, предусмотренном применимым законодательством.</p>
            </section>
            <p className="rounded-lg border border-gray-200 p-4 text-sm dark:border-white/10">
              Документ носит характер предварительной редакции. Перед коммерческим запуском
              оператор должен утвердить полную политику, сроки хранения, правовые основания,
              порядок трансграничной передачи и обязанности по применимому законодательству.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
