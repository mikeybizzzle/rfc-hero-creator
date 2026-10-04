import { Barlow, Gemunu_Libre } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/site-footer";
import "../globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400"],
});

const gemunu = Gemunu_Libre({
  variable: "--font-gemunu",
  subsets: ["latin"],
  weight: "800",
});

export default function ChiHippieLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  setRequestLocale("en");
  return (
    <html lang="en" className={`${barlow.variable} ${gemunu.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
