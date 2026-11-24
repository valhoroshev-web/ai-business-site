import Link from "next/link";
import type { Metadata } from "next";
import InteractiveDemo from "@/components/InteractiveDemo";

const indexable = process.env.SITE_READY_FOR_INDEXING === "true";

export const metadata: Metadata = {
  title: "Демонстрационные сценарии автоматизации | AI PROFI",
  description: "Наглядные примеры обработки запросов, обмена 1С и CRM и отчётности на вымышленных данных.",
  robots: { index: indexable, follow: indexable },
};

export default function DemoPage() {
  return (
    <main>
      <section className="bg-white pb-14 pt-32 dark:bg-gray-dark md:pb-20 md:pt-40">
        <div className="container">
          <nav aria-label="Навигационная цепочка" className="mb-8 flex gap-2 text-sm text-body-color dark:text-body-color-dark">
            <Link href="/" className="hover:text-primary">Главная</Link>
            <span aria-hidden="true">/</span>
            <span className="text-dark dark:text-white">Демонстрации</span>
          </nav>
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Как это может работать</p>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-black dark:text-white md:text-5xl">
              Посмотрите на результат до обсуждения проекта
            </h1>
            <p className="text-lg leading-relaxed text-body-color dark:text-body-color-dark">
              Три наглядных сценария для типовых задач бизнеса: входящие обращения, обмен между
              системами и управленческая отчётность. Выберите сценарий и посмотрите, какие данные
              обрабатываются, какие проверки нужны и что получает сотрудник.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F9FF] py-14 dark:bg-[#121824] md:py-20">
        <div className="container">
          <InteractiveDemo />
        </div>
      </section>

      <section className="bg-white py-14 dark:bg-gray-dark md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 p-7 dark:border-white/10 md:p-9">
            <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">Что это демонстрирует — и чего не демонстрирует</h2>
            <p className="mb-4 leading-relaxed text-body-color dark:text-body-color-dark">
              Здесь моделируются заранее описанные правила и результаты обработки. Данные придуманы
              для объяснения подхода. Примеры не подключены к 1С, CRM, почте или внешним ИИ-моделям
              и не являются результатами работы с реальными заказчиками.
            </p>
            <p className="leading-relaxed text-body-color dark:text-body-color-dark">
              В настоящем проекте требования, интеграции, доступы, тестовые наборы,
              критерии качества и стоимость определяются после обследования процесса.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
