import type { Metadata } from "next";
import { Archivo, Chakra_Petch } from "next/font/google";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700", "900"],
});

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RFC Hero Creator",
  description:
    "Guide for RFC alliance members: create your own Last Z Survival Shooter hero character card with ChatGPT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${chakra.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line mt-24">
          <div className="mx-auto max-w-6xl px-4 py-8 flex flex-wrap items-center justify-between gap-4">
            <p className="hud text-xs text-muted">RFC Hero Creator</p>
            <nav className="flex flex-wrap gap-x-5 gap-y-2">
              {[
                ["Guide", "/guide"],
                ["Builder", "/builder"],
                ["Templates", "/templates"],
                ["Gallery", "/gallery"],
                ["Walkthroughs", "/walkthroughs"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="hud text-xs text-muted hover:text-gold transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
