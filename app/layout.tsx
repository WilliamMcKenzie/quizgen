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
  title: "Quizgen",
  description: "Test yourself on anything.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>{children}</body>
    </html>
  );
}
