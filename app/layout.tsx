import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  // Podstawowe SEO
  title: {
    default: "Damian Bogdanowicz | Filmy i krótkie formy video",
    template: "%s | Damian Bogdanowicz" // Jeśli dodasz podstrony, tytuł będzie się zmieniał
  },
  description: "Portfolio filmowe Damiana Bogdanowicza. Specjalizacja: teledyski, reklamy i krótkie formy narracyjne. Odkryj unikalny styl wizualny.",
  keywords: [
      "Damian Bogdanowicz", 
      "filmowiec Białystok", 
      "produkcja wideo Białystok", 
      "reklamy social media Białystok", 
      "tworzenie rolek", 
      "reels Białystok", 
      "wideo marketing", 
      "teledyski Białystok", 
      "reżyser Białystok", 
      "operator kamery Białystok", 
      "filmy reklamowe konwersja",
      "short-form content bialystok"
    ],  
  authors: [{ name: "Damian Bogdanowicz" }],
  creator: "Damian Bogdanowicz",

  // To odpowiada za MINIATURKĘ (Social Media)
  openGraph: {
    title: "Damian Bogdanowicz | Portfolio Wideo Białystok",
    description: "Reklamy, Rolls, Teledyski. Sprawdź realizacje, które budują zasięgi.",
    url: "https://damian-bogdanowicz-site.vercel.app/", // Zmień na swój adres!
    siteName: "Damian Bogdanowicz",
    images: [
      {
        url: "/opengraph-image.png", // Plik w folderze public
        width: 1200,
        height: 630,
        alt: "Damian Bogdanowicz | Filmy i krótkie formy video",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },

  // Dla X (Twittera)
  twitter: {
    card: "summary_large_image",
    title: "Damian Bogdanowicz | Filmy i krótkie formy video",
    description: "Portfolio filmowe i projekty video.",
    images: ["/opengraph-image.png"],
  },

  // Ikony (Favicon)
  icons: {
    icon: "/favicon.ico",
    apple: "/opengraph-image.png", // Profesjonalna ikona dla iPhone
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness", // Lub "Person"
              "name": "Damian Bogdanowicz - Produkcja Wideo",
              "image": "https://damian-bogdanowicz-site.vercel.app/opengraph-image.png",
              "@id": "https://damian-bogdanowicz-site.vercel.app",
              "url": "https://damian-bogdanowicz-site.vercel.app",
              "telephone": "+48XXXXXXXXX", // Twój numer
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Lipowa",
                "addressLocality": "Białystok",
                "postalCode": "15-000",
                "addressCountry": "PL"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 53.1325, // Koordynaty Białegostoku
                "longitude": 23.1688
              },
              "sameAs": [
                "https://www.instagram.com/damian_bogdanowicz/",
                "https://www.youtube.com/@DamianBogdanowicz"
              ]
            }),
          }}
        />



      </body>
    </html>
  );
}


