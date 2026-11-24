import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import Metrika from "@/components/Analytics/Metrika";
import { Inter } from "next/font/google";
import "../styles/index.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });
const site = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-business-site-tau.vercel.app";
const indexable = process.env.SITE_READY_FOR_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "AI PROFI — ИИ-автоматизация для бизнеса",
  description:
    "Внедрение ИИ-агентов, обработка заявок, интеграции с 1С и CRM и автоматизация рутинных бизнес-процессов.",
  applicationName: "AI PROFI",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "AI PROFI — ИИ-автоматизация для бизнеса",
    description:
      "ИИ-агенты, интеграции и автоматизация процессов под конкретные задачи бизнеса.",
    siteName: "AI PROFI",
    type: "website",
    locale: "ru_RU",
    url: "/",
  },
  robots: { index: indexable, follow: indexable },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="ru">
      <body className={"bg-[#FCFCFC] dark:bg-black " + inter.className}>
        <Providers>
          <div className="isolate">
            <Header />
            {children}
            <Footer />
          </div>
          <ScrollToTop />
          <Metrika counterId={process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID} />
        </Providers>
      </body>
    </html>
  );
}
