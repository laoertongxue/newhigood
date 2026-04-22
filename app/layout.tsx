import type { Metadata } from "next";
import { AppProvider } from "@/lib/components/AppProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "HiGood 供应链管理系统",
  description: "供应链管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
      lang="zh"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
