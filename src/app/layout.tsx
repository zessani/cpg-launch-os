import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CPG Launch OS — Build your brand plan",
  description: "Answer 7 questions and get a complete, personalized CPG launch plan — roadmap, suppliers, margin model, and brand identity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] antialiased bg-[#FAFAF9] text-[#0A0A0A]`}>
        {children}
      </body>
    </html>
  );
}
