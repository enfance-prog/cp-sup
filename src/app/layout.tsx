import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '臨床心理士ポイントマネージャー',
  description: '臨床心理士の資格更新を安全に管理し、手続きを支援するためのアプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className="font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}