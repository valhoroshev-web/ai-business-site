import Link from "next/link";

const footerLinks = [
  { href: "/#services", label: "Услуги" },
  { href: "/#integrations", label: "Интеграции" },
  { href: "/#process", label: "Этапы" },
  { href: "/#faq", label: "Вопросы" },
  { href: "/services/ai-agents", label: "ИИ-агенты" },
  { href: "/services/1c-crm", label: "1С и CRM" },
  { href: "/services/sales-automation", label: "Автоматизация продаж" },
  { href: "/services/reporting", label: "Отчётность" },
];

export default function Footer() {
  return (
    <footer className="bg-white py-12 dark:bg-gray-dark md:py-16">
      <div className="container">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <Link href="/" className="text-xl font-extrabold text-black dark:text-white">
              <span className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">AI</span>
              PROFI
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-body-color dark:text-body-color-dark">
              ИИ-агенты, интеграции и автоматизация бизнес-процессов. Проектируем решения под конкретные задачи и ограничения компаний.
            </p>
          </div>
          <div>
            <h2 className="mb-4 font-semibold text-black dark:text-white">Навигация</h2>
            <nav className="grid grid-cols-2 gap-x-8 gap-y-3" aria-label="Навигация в подвале">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-body-color transition hover:text-primary dark:text-body-color-dark">{link.label}</Link>
              ))}
            </nav>
          </div>
          <div className="max-w-xs">
            <h2 className="mb-4 font-semibold text-black dark:text-white">Связаться</h2>
            <div className="flex flex-col items-start gap-3 text-sm">
              <a href="https://t.me/valeryhor" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                Telegram: @valeryhor
              </a>
              <a href="mailto:valhoroshev@gmail.com" className="break-all font-semibold text-primary hover:underline">
                valhoroshev@gmail.com
              </a>
              <Link href="/#contact" className="text-body-color hover:text-primary dark:text-body-color-dark">
                Все способы связи
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-6 text-xs text-body-color dark:border-white/10 dark:text-body-color-dark">
          AI PROFI · Демонстрационная версия. Коммерческие условия и юридические документы находятся в разработке.
        </div>
      </div>
    </footer>
  );
}
