import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QuoteModalProvider } from "@/hooks/useQuoteModal";
import QuoteModal from "@/components/modals/QuoteModal";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "S&C 신차 장기 렌트 리스",
  description: "신차 장기 렌트카 & 리스 전문 - S&C와 함께 합리적인 가격으로 새 차를 만나보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QuoteModalProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <QuoteModal />
        </QuoteModalProvider>
      </body>
    </html>
  );
}
