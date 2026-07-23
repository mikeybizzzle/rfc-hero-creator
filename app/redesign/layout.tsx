import type { Metadata } from "next";
import { Gemunu_Libre, Saira } from "next/font/google";

const gemunu = Gemunu_Libre({
  variable: "--font-gemunu",
  subsets: ["latin", "latin-ext"],
  weight: "800",
});

const saira = Saira({
  variable: "--font-saira",
  subsets: ["latin", "latin-ext"],
  weight: "900",
});

export const metadata: Metadata = {
  title: "Redesign prototypes",
  robots: { index: false, follow: false },
};

export default function RedesignLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${gemunu.variable} ${saira.variable}`}>{children}</div>
  );
}
