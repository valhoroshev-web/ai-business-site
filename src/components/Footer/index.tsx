import Link from "next/link";

const footerLinks = [
  { href: "/#services", label: "Услуги" },
  { href: "/#integrations", label: "Интеграции" },
  { href: "/#process", label: "Этапы" },
  { href: "/#faq", label: "Вопросы" },
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
            <p className="text-sm leading-relaxed text-body-color dark:text-body-color-dark">
              Канал связи и приём заявок подключаются. Пока сайт работает в режиме демонстрации.
            </p>
            <Link href="/#contact" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Подробнее о консультации</Link>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-6 text-xs text-body-color dark:border-white/10 dark:text-body-color-dark">
          AI PROFI · Демонстрационная версия. Коммерческие условия и юридические документы находятся в разработке.
        </div>
      </div>
    </footer>
  );
}
