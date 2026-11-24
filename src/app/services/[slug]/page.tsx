import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceDetail, serviceSlugs } from "@/data/services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceDetail(slug);
  if (!service) return { title: "Услуга не найдена | AI PROFI", robots: { index: false, follow: false } };
  const ready = process.env.SITE_READY_FOR_INDEXING === "true";

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: "/services/" + service.slug },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url: "/services/" + service.slug,
      type: "website",
      locale: "ru_RU",
      siteName: "AI PROFI",
    },
    robots: { index: ready, follow: ready },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceDetail(slug);
  if (!service) notFound();

  const related = serviceSlugs
    .filter((item) => item !== slug)
    .map((item) => getServiceDetail(item))
    .filter((item) => item !== undefined);

  return (
    <main>
      <section className="relative overflow-hidden bg-white pb-16 pt-32 dark:bg-gray-dark md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute -right-32 -top-36 h-[440px] w-[440px] rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        <div className="container relative">
          <nav aria-label="Навигационная цепочка" className="mb-9 flex flex-wrap items-center gap-2 text-sm text-body-color dark:text-body-color-dark">
            <Link href="/" className="hover:text-primary">Главная</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#services" className="hover:text-primary">Услуги</Link>
            <span aria-hidden="true">/</span>
            <span className="text-dark dark:text-white">{service.eyebrow}</span>
          </nav>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                {service.eyebrow} · AI PROFI
              </p>
              <h1 className="mb-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-black dark:text-white sm:text-4xl xl:text-5xl">
                {service.title}
              </h1>
              <p className="mb-7 max-w-3xl text-lg leading-relaxed text-body-color dark:text-body-color-dark">
                {service.lead}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#contact"
                  className="rounded-lg bg-primary px-7 py-4 text-center text-base font-semibold text-white transition hover:bg-primary/90"
                >
                  Связаться по проекту
                </Link>
                <Link
                  href="#tasks"
                  className="rounded-lg border border-gray-200 px-7 py-4 text-center text-base font-semibold text-black transition hover:border-primary hover:text-primary dark:border-white/20 dark:text-white"
                >
                  Примеры задач
                </Link>
              </div>
              <p className="mt-5 text-sm text-body-color dark:text-body-color-dark">
                Для связи доступны Telegram и электронная почта.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-[#F7F9FF] p-7 shadow-one dark:border-white/10 dark:bg-[#171c28] sm:p-9">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-primary">Для кого</p>
              <p className="mb-7 text-base leading-relaxed text-dark dark:text-white">{service.audience}</p>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-primary">Возможные подключения</p>
              <div className="flex flex-wrap gap-2">
                {service.integrations.map((integration) => (
                  <span key={integration} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-dark dark:border-white/15 dark:bg-white/5 dark:text-white">
                    {integration}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-body-color dark:text-body-color-dark">
                Доступность конкретных интеграций проверяется перед проектированием.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="tasks" className="scroll-mt-24 bg-[#F7F9FF] py-16 dark:bg-[#121824] md:py-24">
        <div className="container">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Типовые задачи</p>
            <h2 className="mb-4 text-3xl font-bold text-black dark:text-white">Какие процессы можно автоматизировать</h2>
            <p className="text-body-color dark:text-body-color-dark">
              Примеры возможных сценариев, а не вымышленные результаты клиентских внедрений.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {service.situations.map((situation, index) => (
              <article key={situation.title} className="rounded-2xl border border-gray-200 bg-white p-7 shadow-one dark:border-white/10 dark:bg-gray-dark">
                <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white">{situation.title}</h3>
                <p className="leading-relaxed text-body-color dark:text-body-color-dark">{situation.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-gray-dark md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Сценарий</p>
              <h2 className="mb-7 text-3xl font-bold leading-tight text-black dark:text-white">
                {service.workflowTitle}
              </h2>
              <ol className="space-y-5">
                {service.workflow.map((item, index) => (
                  <li key={item.step} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="mb-1 font-bold text-black dark:text-white">{item.step}</h3>
                      <p className="leading-relaxed text-body-color dark:text-body-color-dark">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Результат проекта</p>
              <h2 className="mb-7 text-3xl font-bold text-black dark:text-white">Что предусматриваем при внедрении</h2>
              <ul className="space-y-4">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden="true">✓</span>
                    <span className="leading-relaxed text-body-color dark:text-body-color-dark">{deliverable}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-xl border border-gray-200 bg-[#F7F9FF] p-6 dark:border-white/10 dark:bg-white/5">
                <h3 className="mb-3 font-bold text-black dark:text-white">Условия и ограничения</h3>
                <p className="text-sm leading-relaxed text-body-color dark:text-body-color-dark">{service.limitations}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F9FF] py-16 dark:bg-[#121824] md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Оценка результата</p>
            <h2 className="mb-6 text-3xl font-bold text-black dark:text-white">Как проверяем эффект</h2>
            <p className="mb-6 leading-relaxed text-body-color dark:text-body-color-dark">
              До запуска фиксируем исходное состояние процесса и согласуем критерии приёмки.
              Конкретные значения зависят от объёма задач, качества данных и доступных систем.
            </p>
            <ul className="grid gap-3 md:grid-cols-3">
              {service.measures.map((measure) => (
                <li key={measure} className="rounded-xl border border-gray-200 bg-white p-5 text-sm font-semibold leading-relaxed text-dark dark:border-white/10 dark:bg-gray-dark dark:text-white">
                  {measure}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-gray-dark md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Ответы на вопросы</p>
            <h2 className="mb-8 text-3xl font-bold text-black dark:text-white">Что важно знать до внедрения</h2>
            <div className="space-y-4">
              {service.faqs.map((faq) => (
                <details key={faq.question} className="rounded-xl border border-gray-200 bg-[#F7F9FF] p-6 dark:border-white/10 dark:bg-white/5">
                  <summary className="cursor-pointer font-semibold text-black dark:text-white">{faq.question}</summary>
                  <p className="mt-4 leading-relaxed text-body-color dark:text-body-color-dark">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#171E30] py-16 text-white md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#9ab1ff]">Следующий шаг</p>
            <h2 className="mb-5 text-3xl font-bold md:text-4xl">Начнём с одного процесса</h2>
            <p className="mb-8 text-lg leading-relaxed text-[#c5cee0]">
              Определяем исходные данные, ограничения и критерии результата. После оценки
              решаем, нужен ли пилот и какие интеграции потребуются.
            </p>
            <Link
              href="/#contact"
              className="inline-block rounded-lg bg-primary px-8 py-4 font-semibold text-white transition hover:bg-primary/90"
            >
              Написать нам
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-gray-dark md:py-20">
        <div className="container">
          <h2 className="mb-8 text-2xl font-bold text-black dark:text-white">Другие направления AI PROFI</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={"/services/" + item.slug} className="group rounded-xl border border-gray-200 p-6 transition hover:border-primary dark:border-white/10">
                <span className="mb-3 block text-sm font-semibold text-primary">{item.eyebrow}</span>
                <span className="block text-lg font-bold leading-snug text-black group-hover:text-primary dark:text-white">{item.title}</span>
                <span className="mt-4 block text-sm font-semibold text-primary">Подробнее →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
