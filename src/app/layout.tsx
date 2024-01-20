import type { Metadata } from "next";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { Suspense } from "react";
import { siteMeta } from "@/lib/site-meta";

const DINFont = localFont({
  src: "../../public/fonts/DINAlternate-Bold.woff2",
  variable: "--font-din",
});

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
  keywords: siteMeta.keywords,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    url: siteMeta.host,
    siteName: siteMeta.siteName,
    images: [
      {
        url: siteMeta.ogImage,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: siteMeta.title,
    description: siteMeta.description,
    card: "summary_large_image",
    images: [
      {
        url: siteMeta.ogImage,
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: {
    shortcut: "/favicon.ico",
  },
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
        <Suspense fallback={null}>
          {children}
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
