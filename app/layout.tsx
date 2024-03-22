import type { Metadata } from "next";
import { Inter, Gowun_Dodum, Anek_Bangla } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const font_init = Anek_Bangla({
  weight: '400',
  subsets: ["latin"],
  display: "swap",
  variable: "--font-yomogi",
});

export const metadata: Metadata = {
  title: "Quiz Gen",
  description: "Generate, lightening fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${font_init.variable}`}>{children}</body>
    </html>
  );
}
