import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ConsoleGreeting from "./components/ConsoleGreeting";
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
  title: "SGF AidBase — Find Help in Springfield, MO",
  description:
    "Community resource navigator for Springfield, Missouri. Find food banks, shelters, utility assistance, and transportation help.",
  openGraph: {
    title: "SGF AidBase — Find Help in Springfield, MO",
    description:
      "Community resource navigator for Springfield, Missouri. Find food banks, shelters, utility assistance, and transportation help.",
    type: "website",
    url: "https://sgfaidbase.org",
    siteName: "SGF AidBase",
  },
};

/**
 * Root layout — wraps every page with the shared header, footer,
 * and global styles. The sticky header and footer are rendered once
 * here so individual pages only need to provide their <main> content.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Built with ❤️ and ☕ at 3am by Ctrl+Aid+Shift — Springfield Tech Week 2026 */}
      {/* If you're reading this, you're our kind of person. */}
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ConsoleGreeting />
      </body>
    </html>
  );
}
