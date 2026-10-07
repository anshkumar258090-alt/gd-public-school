import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#070b14",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gdpschool.vercel.app"),
  title: {
    default: "GD Public School | Official Website | Admissions Open",
    template: "%s | GD Public School",
  },
  description:
    "Official website of GD Public School (GDPS). Premier educational institution providing world-class CBSE education, smart digital classrooms, state-of-the-art science & computer labs, sports arenas, and holistic character development. Admissions open for session 2025–26.",
  keywords: [
    "GD Public School",
    "GD Public School official website",
    "GDPS",
    "GDPS school",
    "G.D. Public School",
    "GD Public School admission",
    "GD Public School admissions 2025-26",
    "GD Public School CBSE",
    "GD Public School contact",
    "GD Public School portal",
    "Best school GD Public School",
    "GD Public School faculty",
    "GD Public School notices",
    "GD Public School online admission"
  ],
  authors: [{ name: "GD Public School", url: "https://gdpschool.vercel.app" }],
  creator: "GD Public School",
  publisher: "GD Public School",
  alternates: {
    canonical: "https://gdpschool.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gdpschool.vercel.app",
    siteName: "GD Public School",
    title: "GD Public School | Official Website",
    description:
      "Official website of GD Public School. Excellence in holistic education, modern facilities, smart labs, and admissions.",
    images: [
      {
        url: "https://gdpschool.vercel.app/globe.svg",
        width: 1200,
        height: 630,
        alt: "GD Public School Official Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GD Public School | Official Website",
    description:
      "Official portal of GD Public School. Excellence in holistic education, smart classrooms, and character building.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "School"],
  "@id": "https://gdpschool.vercel.app/#school",
  "name": "GD Public School",
  "alternateName": [
    "GDPS",
    "G.D. Public School",
    "GD Public School Official",
    "GD Public School Portal"
  ],
  "url": "https://gdpschool.vercel.app",
  "description":
    "Official website of GD Public School (GDPS). Premier educational institution providing quality CBSE curriculum, smart digital classrooms, modern laboratories, sports arena, and holistic student development.",
  "sameAs": ["https://gdpschool.vercel.app"],
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "CBSE Affiliated",
    "name": "Central Board of Secondary Education"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-[#070b14] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
