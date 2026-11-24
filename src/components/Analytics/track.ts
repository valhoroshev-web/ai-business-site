"use client";

/** Только неперсональные события. Отправка возможна после согласия на Метрику. */
type GoalName = "catalog_open" | "demo_select" | "demo_result" | "contact_open" | "contact_verified" | "contact_click";
type GoalParams = Record<string, string>;

declare global {
  interface Window {
    ym?: (counterId: number, action: string, name: string, params?: GoalParams) => void;
  }
}

export function trackGoal(name: GoalName, params: GoalParams = {}) {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("ai_business_analytics_consent") !== "accepted") return;
    const counterId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);
    if (!Number.isSafeInteger(counterId) || counterId <= 0) return;
    window.ym?.(counterId, "reachGoal", name, params);
  } catch {
    // Отсутствие аналитики никогда не блокирует действия посетителя.
  }
}
