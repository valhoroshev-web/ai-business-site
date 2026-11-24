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
  const complete = Boolean(operatorName && operatorEmail && operatorAddress && process.env.LEGAL_POLICY_APPROVED === "true");

  return (
    <main className="bg-white pb-24 pt-36 dark:bg-gray-dark md:pt-44">
      <div className="container max-w-4xl">
        <Link href="/" className="mb-8 inline-block text-sm font-semibold text-primary hover:underline">← На главную</Link>
        <h1 className="mb-8 text-3xl font-bold text-black dark:text-white md:text-4xl">Обработка персональных данных</h1>
        {!complete ? (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-950">
            Политика обработки персональных данных находится в подготовке.
            На сайте нет собственной формы отправки сообщений. После проверки посетитель
            может открыть Telegram, Яндекс Мессенджер или подготовить письмо в почтовом приложении.
            Перед запуском коммерческого продвижения необходима юридическая проверка
            обработки обращений через эти каналы.
          </div>
        ) : (
          <div className="space-y-7 leading-relaxed text-body-color dark:text-body-color-dark">
            <p>
              Оператор персональных данных: <strong className="text-black dark:text-white">{operatorName}</strong>.
              Адрес: {operatorAddress}. По вопросам обработки данных можно обратиться
              через <Link href="/#contact" className="font-semibold text-primary underline">доступные каналы связи</Link>.
            </p>
            <section>
              <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">1. Какие данные собираем</h2>
              <p>Сайт не содержит собственной формы заявки. При выборе канала связи обрабатываются технические сведения о проверке доступа к контакту. Сообщения, которые посетитель отправляет через Telegram, Яндекс Мессенджер или электронную почту, обрабатываются в соответствующем сервисе и получателем обращения. Аналитика сайта может использоваться при наличии требуемого согласия.</p>
            </section>
            <section>
              <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">2. Для чего используем</h2>
              <p>Сведения из переписки используются для ответа на обращение и обсуждения возможного сотрудничества. Техническая проверка при открытии контактов предназначена для ограничения автоматического сбора адресов. Яндекс Метрика загружается только после отдельного согласия посетителя.</p>
            </section>
            <section>
              <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">3. Сторонние сервисы</h2>
              <p>Сайт размещается на Vercel. Для переписки посетитель самостоятельно выбирает Telegram или электронную почту. Проверка доступа к контактам выполняется сервером сайта. Условия обработки сведений сторонними сервисами и применимые требования к передаче данных необходимо проверить до коммерческого запуска.</p>
            </section>
            <section>
              <h2 className="mb-2 text-xl font-semibold text-black dark:text-white">4. Запросы и удаление</h2>
              <p>Запросы об исправлении сведений, отзыве согласия и удалении информации можно передать через <Link href="/#contact" className="font-semibold text-primary underline">Telegram, Яндекс Мессенджер или электронную почту</Link>. Данные должны удаляться при прекращении оснований для их обработки в порядке, предусмотренном применимым законодательством.</p>
            </section>
            <p className="rounded-lg border border-gray-200 p-4 text-sm dark:border-white/10">
              Шаблон политики требует отдельной юридической проверки, включая сроки хранения,
              правовые основания, трансграничную передачу и обязанности оператора.
              Перед полноценным коммерческим запуском необходимо заменить его утверждённой редакцией.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
