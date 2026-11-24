import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUseCase, useCases, useCaseSlugs } from "@/data/use-cases";
import { getServiceDetail } from "@/data/services";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return useCaseSlugs.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getUseCase(slug);
  if (!item) return { title: "Сценарий не найден | AI PROFI", robots: { index: false, follow: false } };
  const ready = process.env.SITE_READY_FOR_INDEXING === "true";
  const description = item.summary + " Принцип работы, входные данные, ограничения и показатели эффективности.";
  return {
    title: item.title + " — сценарий применения ИИ | AI PROFI",
    description,
    alternates: { canonical: "/use-cases/" + slug },
    openGraph: { title: item.title + " | AI PROFI", description, type: "article", url: "/use-cases/" + slug, locale: "ru_RU" },
    robots: { index: ready, follow: ready },
  };
}

export default async function UseCasePage({ params }: Props) {
  const { slug } = await params;
  const item = getUseCase(slug);
  if (!item) notFound();
  const related = useCases.filter((other) => other.category === item.category && other.slug !== slug).slice(0, 3);
  const service = getServiceDetail(item.service);
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-profi.pro").replace(/\/$/, "");
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: site + "/" },
      { "@type": "ListItem", position: 2, name: "Каталог решений", item: site + "/use-cases" },
      { "@type": "ListItem", position: 3, name: item.title, item: site + "/use-cases/" + slug },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <section className="bg-white pb-14 pt-36 dark:bg-gray-dark md:pb-20 md:pt-44">
        <div className="container">
          <nav aria-label="Навигационная цепочка" className="mb-9 flex flex-wrap gap-2 text-sm text-body-color dark:text-body-color-dark">
            <Link href="/" className="hover:text-primary">Главная</Link><span aria-hidden="true">/</span>
            <Link href="/use-cases" className="hover:text-primary">Каталог решений</Link><span aria-hidden="true">/</span>
            <span className="text-black dark:text-white">{item.title}</span>
          </nav>
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap gap-2 text-sm font-semibold text-primary">
              <span className="rounded-full bg-primary/10 px-3 py-1">{item.category}</span>
              <span className="rounded-full bg-primary/10 px-3 py-1">{item.industry}</span>
            </div>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-black dark:text-white md:text-5xl">{item.title}</h1>
            <p className="mb-6 text-xl leading-relaxed text-body-color dark:text-body-color-dark">{item.summary}</p>
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950">
              Концепция возможного решения, а не подтверждённое внедрение у клиента. Фактический эффект, совместимость и стоимость определяются только после проверки исходных данных и пилота.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-[#F7F9FF] py-14 dark:bg-[#121824] md:py-20">
        <div className="container max-w-5xl">
          <div className="grid gap-7 lg:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-7 dark:border-white/10 dark:bg-gray-dark">
              <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">Проблема бизнеса</h2>
              <p className="leading-relaxed text-body-color dark:text-body-color-dark">{item.problem}</p>
            </article>
            <article className="rounded-2xl border border-gray-200 bg-white p-7 dark:border-white/10 dark:bg-gray-dark">
              <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">Какие данные потребуются</h2>
              <ul className="space-y-3 text-body-color dark:text-body-color-dark">{item.inputs.map((value) => <li key={value} className="flex gap-3"><span className="text-primary" aria-hidden="true">✓</span><span>{value}</span></li>)}</ul>
            </article>
          </div>
          <article className="mt-7 rounded-2xl border border-gray-200 bg-white p-7 dark:border-white/10 dark:bg-gray-dark md:p-10">
            <h2 className="mb-8 text-2xl font-bold text-black dark:text-white">Как может работать автоматизация</h2>
            <ol className="grid gap-5 md:grid-cols-2">{item.steps.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-xl bg-[#F7F9FF] p-5 dark:bg-white/5">
                <span className="shrink-0 text-xl font-bold text-primary">{String(i + 1).padStart(2,"0")}</span>
                <span className="font-medium text-dark dark:text-white">{step}</span>
              </li>
            ))}</ol>
          </article>
          <div className="mt-7 grid gap-7 md:grid-cols-2">
            <article className="rounded-2xl border border-gray-200 bg-white p-7 dark:border-white/10 dark:bg-gray-dark">
              <h2 className="mb-4 text-xl font-bold text-black dark:text-white">Результат процесса</h2>
              <p className="leading-relaxed text-body-color dark:text-body-color-dark">{item.result}</p>
            </article>
            <article className="rounded-2xl border border-gray-200 bg-white p-7 dark:border-white/10 dark:bg-gray-dark">
              <h2 className="mb-4 text-xl font-bold text-black dark:text-white">Что контролирует человек</h2>
              <p className="leading-relaxed text-body-color dark:text-body-color-dark">{item.humanCheck}</p>
            </article>
            <article className="rounded-2xl border border-gray-200 bg-white p-7 dark:border-white/10 dark:bg-gray-dark">
              <h2 className="mb-4 text-xl font-bold text-black dark:text-white">Что измерять на пилоте</h2>
              <ul className="list-disc space-y-2 pl-5 leading-relaxed text-body-color dark:text-body-color-dark">{item.metrics.map((metric) => <li key={metric}>{metric}</li>)}</ul>
              <p className="mt-4 text-xs text-body-color dark:text-body-color-dark">Это критерии для измерения, не заявленные результаты.</p>
            </article>
            <article className="rounded-2xl border border-gray-200 bg-white p-7 dark:border-white/10 dark:bg-gray-dark">
              <h2 className="mb-4 text-xl font-bold text-black dark:text-white">Ограничения и риски</h2>
              <p className="leading-relaxed text-body-color dark:text-body-color-dark">{item.limitations}</p>
            </article>
          </div>
        </div>
      </section>
      <section className="bg-white py-16 dark:bg-gray-dark">
        <div className="container max-w-5xl">
          <div className="rounded-2xl bg-[#171E30] p-8 text-white md:p-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#b7ccff]">Обсудить внедрение</p>
            <h2 className="mb-4 text-3xl font-bold">Проверим этот сценарий на ваших процессах</h2>
            <p className="mb-7 max-w-2xl text-white/80">Начнём с источников данных, правил обработки и ограниченного пилота. Реализуемость, сроки и стоимость определяются по результатам обследования.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/#contact" className="rounded-lg bg-primary px-6 py-4 font-semibold text-white hover:bg-primary/90">Обсудить задачу</Link>
              {service && <Link href={"/services/" + service.slug} className="rounded-lg border border-white/40 px-6 py-4 font-semibold text-white hover:bg-white/10">Услуга: {service.eyebrow}</Link>}
            </div>
          </div>
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-7 text-2xl font-bold text-black dark:text-white">Похожие сценарии</h2>
              <div className="grid gap-5 md:grid-cols-3">{related.map((other) => (
                <Link key={other.slug} href={"/use-cases/" + other.slug} className="rounded-xl border border-gray-200 p-5 transition hover:border-primary dark:border-white/10">
                  <span className="mb-2 block text-xs font-semibold text-primary">{other.industry}</span>
                  <span className="font-bold text-black dark:text-white">{other.title}</span>
                </Link>
              ))}</div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
