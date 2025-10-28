import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "shDrop - Upload. Fetch. Done.",
  description: "Un outil minimaliste pour transférer des fichiers via le terminal. Upload depuis ton navigateur, télécharge avec wget ou curl.",
  keywords: ["file transfer", "upload", "wget", "curl", "terminal", "minimalist"],
  authors: [{ name: "shDrop" }],
  openGraph: {
    title: "shDrop - Upload. Fetch. Done.",
    description: "Un outil minimaliste pour transférer des fichiers via le terminal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
