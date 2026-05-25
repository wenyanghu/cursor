import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatRoom - 即時聊天室",
  description: "Real-time chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  );
}
