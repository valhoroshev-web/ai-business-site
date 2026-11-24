"use client";

import { useState } from "react";
import Link from "next/link";

type DemoId = "sales" | "exchange" | "reports";
type DemoCase = {
  id: DemoId;
  tab: string;
  title: string;
  context: string;
  input: { label: string; value: string }[];
  steps: string[];
  output: { label: string; value: string }[];
  note: string;
  serviceUrl: string;
};

const demos: DemoCase[] = [
  {
    id: "sales",
    tab: "Обращения",
    title: "Письмо клиента → задача менеджеру",
    context: "Типовой запрос на цену и срок поставки. Показываем, какие поля можно извлечь и что передать менеджеру.",
    input: [
      { label: "Источник", value: "Входящее письмо" },
      { label: "Пример обращения", value: "«Здравствуйте! Интересует 40 шт. позиции А-17. Сообщите цену и срок поставки»" },
      { label: "Прайс и остатки", value: "В демонстрации не подключены" },
    ],
    steps: [
      "Распознать тип обращения и выделить товар и количество",
      "Проверить, есть ли подтверждённые данные о цене и сроке",
      "Передать менеджеру запрос без выдуманного коммерческого предложения",
    ],
    output: [
      { label: "Категория", value: "Запрос коммерческого предложения" },
      { label: "Номенклатура", value: "А-17 · 40 шт." },
      { label: "Действие", value: "Создать задачу менеджеру; уточнить цену и срок" },
    ],
    note: "Если источник цены или остатков не подключён, система не должна обещать клиенту условия поставки.",
    serviceUrl: "/services/sales-automation",
  },
  {
    id: "exchange",
    tab: "1С и CRM",
    title: "Несовпадение статусов → задача на проверку",
    context: "Вымышленный заказ существует в двух системах с разными статусами. Пример обработки исключения.",
    input: [
      { label: "CRM", value: "Заказ DEMO-1042 · статус «Согласован»" },
      { label: "1С", value: "Заказ DEMO-1042 · статус «Не проведён»" },
      { label: "Правило", value: "Не перезаписывать данные автоматически при конфликте" },
    ],
    steps: [
      "Сопоставить заказ по согласованному идентификатору",
      "Обнаружить отличие статусов и записать причину",
      "Поставить задачу ответственному на сверку и корректировку",
    ],
    output: [
      { label: "Заказ", value: "DEMO-1042" },
      { label: "Результат проверки", value: "Обнаружено расхождение статусов" },
      { label: "Действие", value: "Передать на ручную проверку; исходные записи не изменять" },
    ],
    note: "Реальная синхронизация требует согласованной системы-источника, карты полей и проверки API конкретной 1С и CRM.",
    serviceUrl: "/services/1c-crm",
  },
  {
    id: "reports",
    tab: "Отчётность",
    title: "План и факт → сигнал об отклонении",
    context: "Пример ежедневной управленческой сводки без доступа к реальной статистике компании.",
    input: [
      { label: "План за день", value: "100 заказов" },
      { label: "Факт за день", value: "82 заказа" },
      { label: "Порог уведомления", value: "Отклонение больше 10% от плана" },
    ],
    steps: [
      "Загрузить фактические значения из согласованных источников",
      "Сравнить факт с планом по одной методике",
      "Отметить отклонение и передать ответственному сотруднику",
    ],
    output: [
      { label: "Отклонение", value: "−18 заказов (−18% к плану)" },
      { label: "Порог", value: "Превышен: 18% > 10%" },
      { label: "Действие", value: "Сообщить о снижении выполнения плана" },
    ],
    note: "Этот пример не рассчитывает прибыль. Для неё нужны достоверные данные о себестоимости, возвратах, комиссиях и расходах.",
    serviceUrl: "/services/reporting",
  },
];

export default function InteractiveDemo() {
  const [selected, setSelected] = useState<DemoId>("sales");
  const [showResult, setShowResult] = useState(false);
  const demo = demos.find((item) => item.id === selected)!;

  return (
    <div className="space-y-7">
      <div role="tablist" aria-label="Примеры бизнес-процессов" className="grid gap-3 sm:grid-cols-3">
        {demos.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={"demo-tab-" + item.id}
            aria-selected={selected === item.id}
            aria-controls="demo-panel"
            onClick={() => {
              setSelected(item.id);
              setShowResult(false);
            }}
            className={
              "rounded-xl border px-5 py-4 text-left font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary " +
              (selected === item.id
                ? "border-primary bg-primary text-white"
                : "border-gray-200 bg-white text-dark hover:border-primary hover:text-primary dark:border-white/15 dark:bg-gray-dark dark:text-white")
            }
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div id="demo-panel" role="tabpanel" aria-labelledby={"demo-tab-" + demo.id} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-one dark:border-white/10 dark:bg-gray-dark">
        <div className="border-b border-gray-200 px-6 py-8 dark:border-white/10 md:px-10">
          <span className="mb-3 inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">
            Условный пример · без подключения к реальным системам
          </span>
          <h2 className="mb-3 text-2xl font-bold text-black dark:text-white md:text-3xl">{demo.title}</h2>
          <p className="max-w-3xl text-body-color dark:text-body-color-dark">{demo.context}</p>
        </div>

        <div className="grid gap-0 lg:grid-cols-2">
          <div className="border-b border-gray-200 p-6 dark:border-white/10 lg:border-b-0 lg:border-r md:p-10">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-primary">01 / Исходные данные</p>
            <dl className="space-y-4">
              {demo.input.map((field) => (
                <div key={field.label} className="rounded-xl border border-gray-200 bg-[#F7F9FF] p-4 dark:border-white/10 dark:bg-white/5">
                  <dt className="mb-2 text-xs font-semibold uppercase tracking-wide text-body-color dark:text-body-color-dark">{field.label}</dt>
                  <dd className="whitespace-pre-line text-sm font-semibold leading-relaxed text-dark dark:text-white">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="p-6 md:p-10">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-primary">02 / Проверки и действия</p>
            <ol className="space-y-5">
              {demo.steps.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{i + 1}</span>
                  <span className="text-sm leading-relaxed text-dark dark:text-white/90">{step}</span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => setShowResult((value) => !value)}
              className="mt-9 w-full rounded-lg bg-primary px-6 py-4 font-semibold text-white transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-expanded={showResult}
              aria-controls="demo-result"
            >
              {showResult ? "Скрыть пример результата" : "Показать пример результата"}
            </button>
          </div>
        </div>

        {showResult && (
          <div id="demo-result" className="border-t border-primary/15 bg-[#F2F6FF] p-6 dark:bg-[#182138] md:p-10" role="region" aria-label="Результат условной обработки">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">03 / Пример результата</p>
              <span className="rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-semibold text-primary dark:bg-white/5">Модельные данные, не запись в CRM или 1С</span>
            </div>
            <dl className="grid gap-4 md:grid-cols-3">
              {demo.output.map((field) => (
                <div key={field.label} className="rounded-xl border border-primary/10 bg-white p-5 dark:border-white/10 dark:bg-gray-dark">
                  <dt className="mb-3 text-xs font-bold uppercase tracking-wide text-body-color dark:text-body-color-dark">{field.label}</dt>
                  <dd className="text-sm font-semibold leading-relaxed text-black dark:text-white">{field.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm leading-relaxed text-dark dark:text-white/85">{demo.note}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-dark sm:flex-row sm:items-center md:p-8">
        <div>
          <h3 className="mb-2 text-lg font-bold text-black dark:text-white">Нужен похожий процесс?</h3>
          <p className="max-w-2xl text-sm leading-relaxed text-body-color dark:text-body-color-dark">
            Здесь показана логика на вымышленных данных. Для реального внедрения нужно проверить учётную систему,
            источники информации, правила действий и критерии приёмки.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href={demo.serviceUrl} className="rounded-lg border border-primary px-5 py-3 text-center text-sm font-semibold text-primary transition hover:bg-primary/5">
            Подробнее
          </Link>
          <Link href="/#contact" className="rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary/90">
            Обсудить задачу
          </Link>
        </div>
      </div>
    </div>
  );
}
