import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServerWakeGuard } from "@/widgets/server-wake-guard/ui/ServerWakeGuard";
import { KakaoSDK } from "@/shared/lib/KakaoSDK";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "마씨(Merci)",
  description: "디지털 추억 앨범 서비스",
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
        {/* 태블릿 최대 너비 컨테이너 — max-w-app(768px) 중앙 정렬 */}
        <div className="mx-auto w-full max-w-app">
          <ServerWakeGuard>
            {children}
          </ServerWakeGuard>
        </div>

        {/* Kakao JavaScript SDK — 카카오톡 공유 기능 */}
        <KakaoSDK />
      </body>
    </html>
  );
}
