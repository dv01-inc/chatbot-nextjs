import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import "katex/dist/katex.min.css";
import {
  ThemeProvider,
  ThemeStyleProvider,
} from "@/components/layouts/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import ClientRoot from "@/components/ClientRoot";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "better-chatbot",
  description:
    "Better Chatbot is a chatbot that uses the Tools to answer questions.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href={
            process.env.NEXT_PUBLIC_AUTH_SHELL_URL ||
            "https://your-auth-shell-url"
          }
          as="script"
          crossOrigin="anonymous"
        />
        <Script
          type="module"
          crossOrigin="anonymous"
          src={
            process.env.NEXT_PUBLIC_AUTH_SHELL_URL ||
            "https://your-auth-shell-url"
          }
        />
        <Script id="api-config" strategy="beforeInteractive">
          {`
            window.apiGatewayUrl = "${
              process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3002"
            }";
            window.apiUrl = window.apiGatewayUrl;
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={["light", "dark"]}
          storageKey="app-theme-v2"
          disableTransitionOnChange
        >
          <ThemeStyleProvider>
            <NextIntlClientProvider>
              <ClientRoot>{children}</ClientRoot>
            </NextIntlClientProvider>
          </ThemeStyleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
