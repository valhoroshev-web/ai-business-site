"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

type Consent = "unknown" | "accepted" | "rejected";

export default function Metrika({ counterId }: { counterId?: string }) {
  const [consent, setConsent] = useState<Consent>("unknown");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ai_business_analytics_consent");
      if (saved === "accepted" || saved === "rejected") setConsent(saved);
    } catch {
      // Хранилище браузера может быть недоступно.
    } finally {
      setLoaded(true);
    }
  }, []);

  if (!counterId || !/^\d+$/.test(counterId) || !loaded) return null;

  const save = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem("ai_business_analytics_consent", value);
    } catch {
      // Аналитика остаётся необязательной.
    }
    setConsent(value);
  };

  const script = [
    '(function(m,e,t,r,i,k,a){',
    'm[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};',
    'm[i].l=1*new Date();',
    'for(var j=0;j<e.scripts.length;j++){if(e.scripts[j].src===r){return;}}',
    'k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);',
    '})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");',
    'ym(' + counterId + ',"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});',
  ].join("\n");

  return (
    <>
      {consent === "accepted" && (
        <Script id="yandex-metrika" strategy="afterInteractive">
          {script}
        </Script>
      )}
      {consent === "unknown" && (
        <div role="dialog" aria-label="Настройка аналитики" className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-5 text-black shadow-2xl dark:border-white/20 dark:bg-[#1e2430] dark:text-white">
          <p className="mb-4 text-sm leading-relaxed">
            Мы используем Яндекс Метрику для анализа посещений только с вашего согласия.
            Необязательная аналитика не влияет на работу сайта.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => save("accepted")} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Разрешить аналитику</button>
            <button type="button" onClick={() => save("rejected")} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold dark:border-white/30">Только необходимые</button>
          </div>
        </div>
      )}
    </>
  );
}
