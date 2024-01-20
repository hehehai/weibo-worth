import type { Metadata } from "next";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

const DINFont = localFont({
  src: "../../public/fonts/DINAlternate-Bold.woff2",
  variable: "--font-din",
});

export const metadata: Metadata = {
  title: "微博账号估值 - 测测你的微博账号值多少钱?",
  description: "输入微博账号快速估算微博账号价值！ 快来试试吧~",
  keywords:
    "微博账号,账号估值,微博价值，账号分享，多少钱，微博估价，微博实时，微博号",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          DINFont.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
