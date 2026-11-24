"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";

const links = [
  { href: "/#services", label: "Услуги" },
  { href: "/#scenarios", label: "Сценарии" },
  { href: "/#integrations", label: "Интеграции" },
  { href: "/#process", label: "Этапы работы" },
  { href: "/#faq", label: "Вопросы" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY >= 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed left-0 top-0 z-50 w-full border-b border-gray-200/40 transition dark:border-white/10 ${sticky || menuOpen ? "bg-white/95 shadow-sticky backdrop-blur-md dark:bg-gray-dark/95" : "bg-white/90 backdrop-blur-sm dark:bg-gray-dark/90"}`}>
      <div className="container flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="shrink-0 text-lg font-extrabold tracking-tight text-black dark:text-white sm:text-xl" aria-label="AI PROFI — главная">
          <span className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">AI</span>
          PROFI
        </Link>
        <nav className="hidden items-center gap-5 xl:gap-7 lg:flex" aria-label="Основное меню">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-dark transition hover:text-primary dark:text-white/80 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/#contact" className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90">Обсудить проект</Link>
          <ThemeToggler />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggler />
          <button
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xl text-dark dark:border-white/20 dark:text-white"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" className="border-t border-gray-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-gray-dark lg:hidden" aria-label="Мобильное меню">
          <div className="container flex flex-col gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-dark hover:bg-primary/10 dark:text-white">
                {link.label}
              </Link>
            ))}
            <Link href="/#contact" onClick={() => setMenuOpen(false)} className="mt-2 rounded-lg bg-primary px-4 py-3 text-center font-semibold text-white">Обсудить проект</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
