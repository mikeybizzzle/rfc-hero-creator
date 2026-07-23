import type { Metadata } from "next";
import { Barlow, Lilita_One } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

const lilita = Lilita_One({
  variable: "--font-lilita",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "RfC Hero Forge",
  description:
    "Guide for RfC alliance members: create your own Last Z Survival Shooter hero character card with ChatGPT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${lilita.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <footer className="mt-16">
          <div className="mx-auto max-w-6xl px-4 py-8 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-muted">
            <span className="font-bold text-gold">RfC alliance</span>
            <span>Last Z: Survival Shooter</span>
            <span>Works with the ChatGPT app or chatgpt.com</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
