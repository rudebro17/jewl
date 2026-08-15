import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JEWL — Jewelry for the New Era",
  description:
    "Real gold and real silver jewelry designed for a new generation. Mythology, Gothic, and Culture collections. Precious metals for those who wear their stories.",
  keywords: [
    "jewelry",
    "gold jewelry",
    "silver jewelry",
    "mythology jewelry",
    "gothic jewelry",
    "premium jewelry India",
    "925 silver",
    "18K gold",
    "JEWL",
  ],
  openGraph: {
    title: "JEWL — Jewelry for the New Era",
    description:
      "Real gold and silver jewelry inspired by mythology, gothic culture, and modern identity.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
