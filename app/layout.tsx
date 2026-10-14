import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { IntroSplash } from "@/components/intro-splash";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Arzoo Watches | Watches delivered across Pakistan",
    template: "%s | Arzoo Watches",
  },
  description:
    "Shop men's, women's, smart and luxury watches online in Pakistan. Pay with Cash on Delivery or Easypaisa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <IntroSplash />
        <div className="site-canvas">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
