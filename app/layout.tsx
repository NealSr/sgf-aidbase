import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
