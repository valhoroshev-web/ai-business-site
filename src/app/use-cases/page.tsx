import Link from "next/link";
import type { Metadata } from "next";
import UseCaseCatalog from "@/components/UseCaseCatalog";
import { useCases } from "@/data/use-cases";

const ready = process.env.SITE_READY_FOR_INDEXING === "true";
export const metadata: Metadata = {
  title: "Применение ИИ в бизнесе: каталог решений и сценариев | AI PROFI",
  description: "Практические сценарии ИИ-автоматизации продаж, 1С, CRM, закупок, маркетплейсов, производства и других задач. Поиск по направлениям и отраслям.",
  alternates: { canonical: "/use-cases" },
  openGraph: { title: "Каталог применений ИИ для бизнеса | AI PROFI", description: "Выберите бизнес-задачу и узнайте, как её можно автоматизировать.", url: "/use-cases" },
  robots: { index: ready, follow: ready },
};

export default function UseCasesPage() {
  return (
    <main>
      <section className="bg-white pb-14 pt-36 dark:bg-gray-dark md:pt-44">
        <div className="container">
          <nav aria-label="Навигационная цепочка" className="mb-7 flex gap-2 text-sm text-body-color dark:text-body-color-dark">
            <Link href="/" className="hover:text-primary">Главная</Link><span aria-hidden="true">/</span>
            <span className="text-black dark:text-white">Каталог решений</span>
          </nav>
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-primary">Библиотека возможностей ИИ</p>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-black dark:text-white md:text-5xl">
              {useCases.length} практических сценариев применения ИИ в бизнесе
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-body-color dark:text-body-color-dark">
              От обработки заказов и работы с 1С до компьютерного зрения, документов и управления запасами. Найдите задачу, изучите механизм решения, ограничения и критерии проверки результата.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-[#F7F9FF] py-14 dark:bg-[#121824] md:py-20">
        <div className="container"><UseCaseCatalog /></div>
      </section>
      <section className="bg-white py-14 dark:bg-gray-dark">
        <div className="container max-w-4xl">
          <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">Не нашли нужный процесс?</h2>
          <p className="mb-6 leading-relaxed text-body-color dark:text-body-color-dark">Библиотека не ограничивает перечень задач, которые можно обсудить. Для начала достаточно описать текущую операцию, источники данных и ожидаемый результат.</p>
          <Link href="/#contact" className="inline-flex rounded-lg bg-primary px-6 py-4 font-semibold text-white hover:bg-primary/90">Обсудить задачу</Link>
        </div>
      </section>
    </main>
  );
}
