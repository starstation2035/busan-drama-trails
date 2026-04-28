import type { Metadata } from "next";
import { Layout } from "@/components/Layout";
import "../styles.css";

export const metadata: Metadata = {
  title: "부산여행 정보 및 스타일 추천",
  description: "Discover K-drama filming locations, restaurants, and cafes in Busan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
