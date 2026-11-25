import Link from "next/link";
import ContactMethods from "@/components/ContactMethods";
import type { Metadata } from "next";
import { useCases } from "@/data/use-cases";

export const metadata: Metadata = {
  title: "ИИ-автоматизация бизнеса, ИИ-агенты и интеграции | AI PROFI",
  description:
    "AI PROFI: ИИ-агенты для обработки обращений, интеграции 1С и CRM, автоматизированная отчётность и устранение рутинных операций в бизнесе.",
  // Индексацию включаем после утверждения юридической документации и контента.
  robots: { index: process.env.SITE_READY_FOR_INDEXING === "true", follow: process.env.SITE_READY_FOR_INDEXING === "true" },
};

const services = [
  {
    number: "01",
    title: "ИИ-операторы для клиентов",
    description:
      "Принимают типовые обращения, уточняют потребности, собирают данные и передают сложные вопросы сотрудникам.",
    tags: ["Заявки", "CRM", "Мессенджеры"],
    href: "/services/sales-automation",
  },
  {
    number: "02",
    title: "ИИ-агенты для рутинных задач",
    description:
      "Выполняют повторяющиеся операции по заданному сценарию: от обработки писем до подготовки документов и сводок.",
    tags: ["Почта", "Документы", "Контроль"],
    href: "/services/ai-agents",
  },
  {
    number: "03",
    title: "Интеграции систем",
    description:
      "Настраиваем обмен данными между 1С, CRM, таблицами, почтой и внешними сервисами, чтобы убрать повторный ввод.",
    tags: ["1С", "CRM", "API"],
    href: "/services/1c-crm",
  },
  {
    number: "04",
    title: "Автоматизация отчётности",
    description:
      "Собираем показатели из разных источников, формируем отчёты и уведомляем об отклонениях.",
    tags: ["Аналитика", "Отчёты", "Уведомления"],
    href: "/services/reporting",
  },
  {
    number: "05",
    title: "Аудит и сопровождение",
    description:
      "Проверяем существующие автоматизации, исправляем ошибки, улучшаем сценарии и контролируем стабильность.",
    tags: ["Аудит", "Поддержка", "Развитие"],
  },
  {
    number: "06",
    title: "Обучение сотрудников",
    description:
      "Объясняем команде, как использовать нейросети в ежедневной работе и безопасно внедрять новые инструменты.",
    tags: ["Практика", "Команда", "ИИ"],
  },
  {
    number: "07",
    title: "ИИ-автоматизация рекламных кампаний",
    description:
      "Анализируем статистику Яндекс Директа и проверяем предлагаемые ставки перед изменением.",
    tags: ["Яндекс Директ", "Аналитика", "Ставки"],
    href: "/services/advertising-automation",
  },
];

const scenarios = [
  {
    label: "Отдел продаж",
    title: "Обращения клиентов → задачи в CRM",
    before: "Менеджер вручную разбирает типовые вопросы и переносит сведения из переписки в CRM.",
    solution: "ИИ уточняет необходимые данные, подготавливает карточку обращения и передаёт сложные случаи сотруднику.",
    measure: "Время до первого ответа, полнота карточек, количество ручных исправлений.",
    href: "/services/sales-automation",
  },
  {
    label: "Коммерческий и операционный отдел",
    title: "Заказы и статусы → согласованные данные",
    before: "Один и тот же заказ и его статус приходится сверять между 1С, CRM и таблицами.",
    solution: "Настраиваем обмен по согласованным правилам, проверку дублей и уведомления об ошибках.",
    measure: "Доля успешных обменов, количество дублей, затраты времени на сверку.",
    href: "/services/1c-crm",
  },
  {
    label: "Руководитель",
    title: "Данные из систем → отчёт и отклонения",
    before: "Показатели из учётных систем и каналов продаж собираются вручную, поэтому отчёт запаздывает.",
    solution: "Формируем сводку по расписанию, проверяем входные данные и отмечаем отклонения от плана.",
    measure: "Время подготовки отчёта, полнота данных, число обнаруженных расхождений.",
    href: "/services/reporting",
  },
];

const principles = [
  {
    number: "01",
    title: "Минимально необходимые доступы",
    body: "Сначала определяем, какие данные и действия действительно нужны. Возможности интеграции и права проверяются до подключения.",
  },
  {
    number: "02",
    title: "Контроль важных решений",
    body: "Для неоднозначных запросов, нестандартных случаев и значимых изменений предусматриваем согласование с ответственным сотрудником.",
  },
  {
    number: "03",
    title: "Понятные критерии приёмки",
    body: "До пилота фиксируем правила обработки, тестовые сценарии и показатели, по которым оцениваем работоспособность.",
  },
  {
    number: "04",
    title: "План на случай ошибки",
    body: "Заранее обсуждаем журналирование, уведомления о сбоях и возможность ручной обработки задачи, если автоматизация недоступна.",
  },
];
const steps = [
  ["01", "Разбор задачи", "Выясняем, что сейчас делается вручную, где теряется время и какие данные нужны."],
  ["02", "Проектирование", "Согласуем сценарий, интеграции, ограничения и критерии результата."],
  ["03", "Внедрение", "Запускаем решение на согласованном участке процесса и проверяем реальные случаи."],
  ["04", "Сопровождение", "Следим за качеством, устраняем сбои и постепенно расширяем автоматизацию."],
];

const integrations = ["1С", "Битрикс24", "amoCRM", "Telegram", "Электронная почта", "Google Таблицы", "REST API", "Маркетплейсы"];

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{label}</p>
      <h2 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white md:text-4xl">{title}</h2>
      <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark md:text-lg">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-white pb-20 pt-36 dark:bg-gray-dark md:pb-28 md:pt-44" id="top">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[580px] w-[580px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-primary/5 blur-3xl" />
        <div className="container relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                AI PROFI · ИИ-автоматизация бизнеса
              </div>
              <h1 className="mb-7 text-4xl font-extrabold leading-[1.12] tracking-tight text-black dark:text-white sm:text-5xl xl:text-6xl">
                Автоматизируем рутину в продажах и управлении{" "}
                <span className="text-primary">с помощью ИИ</span>
              </h1>
              <p className="mb-7 max-w-xl text-lg leading-relaxed text-body-color dark:text-body-color-dark">
                Сокращаем ручную обработку заявок, перенос данных между 1С и CRM
                и подготовку отчётов. Начинаем с одного процесса, согласуем
                критерии результата и проверяем решение на практике.
              </p>
              <div className="mb-9 grid max-w-xl gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200/90 bg-[#F7F9FF] px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">01</span>
                  <span className="text-sm font-semibold leading-snug text-dark dark:text-white">Меньше ручных операций</span>
                </div>
                <div className="rounded-xl border border-gray-200/90 bg-[#F7F9FF] px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">02</span>
                  <span className="text-sm font-semibold leading-snug text-dark dark:text-white">Обмен данными без копирования</span>
                </div>
                <div className="rounded-xl border border-gray-200/90 bg-[#F7F9FF] px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">03</span>
                  <span className="text-sm font-semibold leading-snug text-dark dark:text-white">Контроль сложных ситуаций</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#contact"
                  className="rounded-lg bg-primary px-7 py-4 text-center text-base font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
                >
                  Обсудить задачу
                </Link>
                <Link
                  href="/use-cases"
                  className="rounded-lg border border-gray-200 bg-white px-7 py-4 text-center text-base font-semibold text-black transition hover:border-primary hover:text-primary dark:border-white/20 dark:bg-white/5 dark:text-white"
                >
                  Каталог ИИ-решений
                </Link>
              </div>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-body-color dark:text-body-color-dark">
                Для первого разговора достаточно описать процесс, используемые системы и основную проблему. Связаться можно через Telegram, почту или Яндекс Мессенджер.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute inset-5 rounded-3xl bg-primary/20 blur-3xl" aria-hidden="true" />
              <div className="relative rounded-3xl border border-white/10 bg-[#161f34] p-5 text-white shadow-2xl sm:p-7">
                <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <div className="mb-1 text-xs uppercase tracking-[0.18em] text-[#9eacda]">Пример процесса</div>
                    <div className="text-lg font-semibold">Обработка входящей заявки</div>
                  </div>
                  <span className="rounded-full bg-[#2d6b61] px-3 py-1 text-xs text-[#c9fff0]">Сценарий</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#334462] text-sm font-bold">01</div>
                    <div><div className="font-semibold">Клиентский запрос</div><div className="text-sm text-[#b6bfd5]">Почта · сайт · мессенджер</div></div>
                  </div>
                  <div className="mx-auto h-5 w-px bg-[#6077bc]" />
                  <div className="flex items-center gap-4 rounded-xl border border-primary/40 bg-primary/15 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary font-bold">AI</div>
                    <div><div className="font-semibold">ИИ-агент</div><div className="text-sm text-[#c3cdf4]">Проверка · классификация · ответ</div></div>
                  </div>
                  <div className="mx-auto h-5 w-px bg-[#6077bc]" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="mb-2 text-sm font-semibold">Передача в CRM</div>
                      <div className="text-xs text-[#b6bfd5]">Данные и задача менеджеру</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="mb-2 text-sm font-semibold">Контроль сотрудника</div>
                      <div className="text-xs text-[#b6bfd5]">Сложные случаи — человеку</div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-xs text-[#a6b3d0]">Иллюстрация архитектуры, не статистика внедрения</div>
              </div>
            </div>
          </div>
        </div>
      </section>

            <section className="bg-[#F7F9FF] py-16 dark:bg-[#121824] md:py-24" id="use-cases">
        <div className="container">
          <div className="mx-auto mb-11 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Библиотека AI PROFI</p>
            <h2 className="mb-5 text-3xl font-bold text-black dark:text-white md:text-4xl">Найдите применение ИИ для своей задачи</h2>
            <p className="text-lg leading-relaxed text-body-color dark:text-body-color-dark">30 сценариев по продажам, 1С, маркетплейсам, производству, документам и другим направлениям. Объясняем процесс, исходные данные и ограничения — без вымышленных результатов внедрений.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {useCases.filter((item) => ["email-orders-1c", "marketplace-replenishment", "supplier-offers", "manuals-semantic-search", "visual-defect-inspection", "contract-differences"].includes(item.slug)).map((item) => (
              <Link key={item.slug} href={"/use-cases/" + item.slug} className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-primary hover:shadow-lg dark:border-white/10 dark:bg-gray-dark">
                <span className="mb-3 block text-xs font-semibold text-primary">{item.category} · {item.industry}</span>
                <h3 className="mb-3 text-lg font-bold text-black dark:text-white">{item.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-body-color dark:text-body-color-dark">{item.summary}</p>
                <span className="text-sm font-semibold text-primary">Изучить сценарий →</span>
              </Link>
            ))}
          </div>
          <div className="mt-9 text-center"><Link href="/use-cases" className="inline-flex rounded-lg bg-primary px-7 py-4 font-semibold text-white hover:bg-primary/90">Все 30 сценариев применения ИИ</Link></div>
        </div>
      </section>

<section className="bg-[#F7F9FF] py-20 dark:bg-[#121824] md:py-28" id="services">
        <div className="container">
          <SectionHeading
            label="Чем помогаем"
            title="Автоматизация под реальные задачи"
            description="Не внедряем ИИ ради ИИ. Находим повторяющиеся операции, проектируем сценарий и связываем инструменты в один процесс."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.number} className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-7 shadow-one transition hover:-translate-y-1 hover:shadow-feature-2 dark:border-white/10 dark:bg-gray-dark">
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">{service.number}</div>
                <h3 className="mb-4 text-xl font-bold leading-snug text-black dark:text-white">{service.title}</h3>
                <p className="mb-6 flex-1 text-base leading-relaxed text-body-color dark:text-body-color-dark">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#EFF3FE] px-3 py-1 text-xs font-medium text-[#4460af] dark:bg-white/10 dark:text-[#bbcafa]">{tag}</span>
                  ))}
                </div>
                {"href" in service && service.href ? (
                  <Link
                    href={service.href}
                    className="mt-7 inline-flex items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
                    aria-label={"Подробнее: " + service.title}
                  >
                    Подробнее об услуге <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-gray-dark md:py-28" id="scenarios">
        <div className="container">
          <SectionHeading
            label="Конкретные задачи"
            title="Как выглядит автоматизация на практике"
            description="Три примера для обсуждения проекта. Это возможные сценарии, а не отчёты о выполненных внедрениях или обещания экономии."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <article key={scenario.title} className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-one dark:border-white/10 dark:bg-[#171c28]">
                <div className="border-b border-gray-200 bg-[#F2F5FF] px-6 py-5 text-sm font-semibold uppercase tracking-wider text-primary dark:border-white/10 dark:bg-white/5">
                  {scenario.label}
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="mb-6 text-xl font-bold leading-snug text-black dark:text-white">{scenario.title}</h3>
                  <dl className="flex-1 space-y-5">
                    <div>
                      <dt className="mb-2 text-xs font-bold uppercase tracking-wider text-body-color dark:text-body-color-dark">Сейчас</dt>
                      <dd className="leading-relaxed text-dark dark:text-white/85">{scenario.before}</dd>
                    </div>
                    <div>
                      <dt className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Что автоматизируем</dt>
                      <dd className="leading-relaxed text-dark dark:text-white/85">{scenario.solution}</dd>
                    </div>
                    <div className="rounded-xl bg-[#F2F5FF] p-4 dark:bg-white/5">
                      <dt className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Как проверим пользу</dt>
                      <dd className="text-sm leading-relaxed text-dark dark:text-white/85">{scenario.measure}</dd>
                    </div>
                  </dl>
                  <Link href={scenario.href} className="mt-6 inline-flex self-start text-sm font-semibold text-primary hover:underline">
                    Подробнее о решении <span className="ml-2" aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-9 flex flex-col items-center gap-4 text-center">
            <p className="max-w-3xl text-sm leading-relaxed text-body-color dark:text-body-color-dark">
              Фактическая применимость и показатели зависят от доступных систем, качества исходных данных и согласованного объёма работ.
            </p>
            <Link href="/demo" className="inline-flex items-center justify-center rounded-lg bg-primary px-7 py-4 text-base font-semibold text-white transition hover:bg-primary/90">
              Открыть интерактивные примеры <span className="ml-2" aria-hidden="true">→</span>
            </Link>
            <span className="text-xs leading-relaxed text-body-color dark:text-body-color-dark">Тестовые данные, без подключения к реальным системам</span>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F9FF] py-20 dark:bg-[#121824] md:py-28" id="approach">
        <div className="container">
          <SectionHeading
            label="Подход к внедрению"
            title="Автоматизация с контролем бизнеса"
            description="Прежде чем передать ИИ доступ к рабочим процессам, согласуем границы действий, проверки и действия при ошибках."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((item) => (
              <article key={item.number} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-one dark:border-white/10 dark:bg-gray-dark">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {item.number}
                </div>
                <h3 className="mb-3 text-lg font-bold text-black dark:text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-body-color dark:text-body-color-dark">{item.body}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-7 max-w-3xl text-center text-sm leading-relaxed text-body-color dark:text-body-color-dark">
            Сценарии и меры контроля проектируются индивидуально. Здесь описан подход, а не подтверждённые результаты выполненных проектов.
          </p>
        </div>
      </section>

      <section className="bg-[#F7F9FF] py-20 dark:bg-[#121824] md:py-28" id="integrations">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Интеграции</p>
              <h2 className="mb-6 text-3xl font-bold leading-tight text-black dark:text-white md:text-4xl">Данные должны работать вместе</h2>
              <p className="mb-5 text-lg leading-relaxed text-body-color dark:text-body-color-dark">
                У компании уже есть учётные системы, CRM, таблицы и каналы общения. Наша задача — связать их и убрать ручной перенос информации.
              </p>
              <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark">
                Возможность каждой интеграции проверяем индивидуально: по доступным API, правам доступа и требованиям безопасности.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-one dark:border-white/10 dark:bg-gray-dark sm:p-8">
              <p className="mb-5 text-sm font-semibold text-black dark:text-white">Системы и каналы, которые рассматриваем</p>
              <div className="grid grid-cols-2 gap-3">
                {integrations.map((item) => (
                  <div key={item} className="rounded-xl border border-gray-200 px-4 py-4 text-center text-sm font-semibold text-dark dark:border-white/10 dark:bg-white/5 dark:text-white">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-gray-dark md:py-28" id="process">
        <div className="container">
          <SectionHeading
            label="Как работаем"
            title="От задачи до работающего процесса"
            description="Сначала оцениваем техническую реализуемость и стоимость, затем тестируем решение на конкретных данных и сценариях."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(([number, title, body]) => (
              <div key={number} className="border-l-2 border-primary pl-6">
                <span className="mb-5 block text-3xl font-bold text-primary/60">{number}</span>
                <h3 className="mb-3 text-xl font-bold text-black dark:text-white">{title}</h3>
                <p className="leading-relaxed text-body-color dark:text-body-color-dark">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-6 rounded-3xl border border-primary/15 bg-[#F7F9FF] p-7 dark:border-white/10 dark:bg-white/5 md:grid-cols-[1fr_1.15fr] md:gap-10 md:p-10">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Что обсуждаем до запуска</p>
              <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">Пилот вместо большого проекта вслепую</h3>
              <p className="leading-relaxed text-body-color dark:text-body-color-dark">
                Определяем одну повторяемую задачу и ограничения. По итогам пилота решаем,
                стоит ли масштабировать решение. Состав и стоимость работ согласуем после оценки доступов и данных.
              </p>
              <Link href="/#contact" className="mt-6 inline-flex font-semibold text-primary hover:underline">
                Обсудить процесс <span className="ml-2" aria-hidden="true">→</span>
              </Link>
            </div>
            <div>
              <h4 className="mb-5 font-bold text-black dark:text-white">На что ориентируемся при приёмке</h4>
              <ul className="space-y-4 text-sm leading-relaxed text-dark dark:text-white/90">
                <li className="flex gap-3"><span className="font-bold text-primary" aria-hidden="true">01</span><span>Описание процесса, источников данных и условий, при которых нужен сотрудник.</span></li>
                <li className="flex gap-3"><span className="font-bold text-primary" aria-hidden="true">02</span><span>Тестирование на согласованных примерах, включая ошибки и нестандартные запросы.</span></li>
                <li className="flex gap-3"><span className="font-bold text-primary" aria-hidden="true">03</span><span>Сравнение исходных и фактических показателей по заранее выбранной методике.</span></li>
                <li className="flex gap-3"><span className="font-bold text-primary" aria-hidden="true">04</span><span>Понятный порядок поддержки, контроля и дальнейшего изменения сценария.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F9FF] py-20 dark:bg-[#121824] md:py-28" id="faq">
        <div className="container">
          <SectionHeading
            label="Частые вопросы"
            title="Что важно до старта"
            description="Чтобы автоматизация приносила пользу, нужно учитывать качество данных, ограничения сервисов и контроль результата."
          />
          <div className="mx-auto max-w-3xl space-y-3">
            {[
              ["Нужно ли менять существующую CRM или 1С?", "Не обязательно. Вначале проверяем, можно ли подключить уже используемые системы и безопасно организовать обмен данными."],
              ["ИИ полностью заменяет сотрудников?", "Нет. В критичных и нестандартных случаях предусматриваем передачу задачи человеку, проверки и журнал действий."],
              ["Можно ли начать с одного небольшого процесса?", "Да. Пилот на одной задаче позволяет измерить эффект до масштабирования и избежать лишних затрат."],
              ["Как оценивается стоимость?", "После описания задачи и проверки ограничений систем. Без этих данных точную цену и сроки обещать некорректно."],
            ].map(([question, answer]) => (
              <details key={question} className="group rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-gray-dark">
                <summary className="cursor-pointer list-none pr-3 text-base font-semibold text-black dark:text-white">{question}</summary>
                <p className="mt-4 leading-relaxed text-body-color dark:text-body-color-dark">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#171E30] py-20 text-white md:py-28" id="contact">
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#9ab1ff]">Следующий шаг</p>
            <h2 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">Расскажите, какую работу хотите автоматизировать</h2>
            <p className="mb-8 text-lg leading-relaxed text-[#c5cee0]">
              Напишите через Telegram, электронную почту или Яндекс Мессенджер.
              Для начала достаточно указать задачу, используемые сервисы и желаемый результат.
              Перед открытием контакта потребуется короткая проверка.
            </p>
            <ContactMethods yandexEnabled={Boolean(process.env.CONTACT_YANDEX_URL)} />
          </div>
        </div>
      </section>
    </main>
  );
}
