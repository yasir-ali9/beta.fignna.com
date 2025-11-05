import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { ToastProvider } from "@/components/toast";
import { FaviconManager } from "@/components/favicon";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fignna",
  description: "Talk to AI. Get an app.",
  icons: {
    icon: [
      {
        url: "/icons/favicon-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/favicon-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <FaviconManager />
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
