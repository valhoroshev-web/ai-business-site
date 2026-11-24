"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCaseCategories, useCases } from "@/data/use-cases";
import { trackGoal } from "@/components/Analytics/track";

export default function UseCaseCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [industry, setIndustry] = useState("all");
  const industries = useMemo(() => Array.from(new Set(useCases.map((item) => item.industry))).sort((a,b) => a.localeCompare(b,"ru")), []);
  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("ru");
    return useCases.filter((item) =>
      (category === "all" || item.category === category) &&
      (industry === "all" || item.industry === industry) &&
      (!term || [item.title, item.summary, item.problem, item.category, item.industry, ...item.inputs].join(" ").toLocaleLowerCase("ru").includes(term))
    );
  }, [query, category, industry]);

  return (
    <div>
      <div className="mb-9 grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-dark md:grid-cols-3 md:p-7">
        <label className="space-y-2 text-sm font-semibold text-dark dark:text-white">
          <span>Поиск по бизнес-задаче</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Например: 1С, склад, договор…" className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-normal text-black outline-offset-2 focus:outline-primary dark:border-white/20 dark:bg-[#242c3a] dark:text-white" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-dark dark:text-white">
          <span>Направление</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 font-normal text-black dark:border-white/20 dark:bg-[#242c3a] dark:text-white">
            <option value="all">Все направления</option>
            {useCaseCategories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="space-y-2 text-sm font-semibold text-dark dark:text-white">
          <span>Отрасль или отдел</span>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 font-normal text-black dark:border-white/20 dark:bg-[#242c3a] dark:text-white">
            <option value="all">Все отрасли</option>
            {industries.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div aria-live="polite" className="mb-6 flex items-center justify-between gap-3 text-sm text-body-color dark:text-body-color-dark">
        <span>Найдено сценариев: <strong className="text-black dark:text-white">{visible.length}</strong></span>
        {(query || category !== "all" || industry !== "all") && (
          <button type="button" onClick={() => { setQuery(""); setCategory("all"); setIndustry("all"); }} className="font-semibold text-primary hover:underline">Сбросить фильтры</button>
        )}
      </div>
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-white/10 dark:bg-gray-dark">
          <p className="mb-3 text-xl font-semibold text-black dark:text-white">По такому запросу решений пока нет</p>
          <p className="text-body-color dark:text-body-color-dark">Попробуйте другое слово или сбросьте фильтры.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <article key={item.slug} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-7 transition hover:border-primary/50 hover:shadow-lg dark:border-white/10 dark:bg-gray-dark">
              <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{item.category}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-white/10 dark:text-gray-200">{item.industry}</span>
              </div>
              <h2 className="mb-3 text-xl font-bold leading-snug text-black dark:text-white">
                <Link href={"/use-cases/" + item.slug} onClick={() => trackGoal("catalog_open", { slug: item.slug, category: item.category })} className="hover:text-primary">{item.title}</Link>
              </h2>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-body-color dark:text-body-color-dark">{item.summary}</p>
              <Link href={"/use-cases/" + item.slug} onClick={() => trackGoal("catalog_open", { slug: item.slug, category: item.category })} className="inline-flex font-semibold text-primary hover:underline" aria-label={"Подробнее: " + item.title}>Разобрать сценарий <span className="ml-2" aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      )}
      <p className="mt-10 text-sm leading-relaxed text-body-color dark:text-body-color-dark">
        Материалы — проектные сценарии, а не отчёты о завершённых клиентских внедрениях. Возможность интеграции, стоимость и требования к данным определяются после обследования конкретного процесса.
      </p>
    </div>
  );
}
