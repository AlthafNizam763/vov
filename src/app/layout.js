import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://www.voiceofthevoiceless.co.in";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Voice of the Voiceless | Charity & NGO in Kerala, India",
    template: "%s | Voice of the Voiceless",
  },
  description:
    "Voice of the Voiceless is a Kerala-based nonprofit helping people in need through compassion, awareness, and action. Donate today and change a life.",
  applicationName: "Voice of the Voiceless",
  authors: [{ name: "Voice of the Voiceless" }],
  creator: "Voice of the Voiceless",
  publisher: "Voice of the Voiceless",
  category: "Nonprofit",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  verification: {
    google: "PsWL1dgJXP5GSxTc8DwmLqLHoY_9YBsLfGwDs1vCcDM",
  },
  keywords: [
    "Voice of the Voiceless",
    "NGO",
    "charity",
    "NGO in Kerala",
    "charity in Kerala",
    "Thiruvananthapuram NGO",
    "social work",
    "donation",
    "donate online",
    "humanitarian",
    "volunteering",
    "differently abled support",
    "nonprofit organization",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Voice of the Voiceless | Charity & NGO in Kerala, India",
    description:
      "Let's donate now to help fellow humans in need. Together, we can give voice to the voiceless.",
    url: SITE_URL,
    siteName: "Voice of the Voiceless",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Voice of the Voiceless — humanitarian charity in Kerala",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice of the Voiceless | Charity & NGO in Kerala",
    description:
      "Join us in empowering the unheard through compassion and action. Donate today.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/vov-logo.png",
  },
};

export const viewport = {
  themeColor: "#1f7fd6",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Structured Data for SEO (Schema.org @graph: NGO + WebSite) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": ["NGO", "Organization"],
                  "@id": `${SITE_URL}/#organization`,
                  name: "Voice of the Voiceless",
                  alternateName: "VoV",
                  url: SITE_URL,
                  logo: {
                    "@type": "ImageObject",
                    url: `${SITE_URL}/images/vov-logo.png`,
                  },
                  image: `${SITE_URL}/og-image.png`,
                  description:
                    "Voice of the Voiceless is a humanitarian initiative to support people in need through awareness, aid, and action.",
                  email: "info.voiceofthevoiceless1@gmail.com",
                  telephone: "+91-80758-73624",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress:
                      "TC 53/1542, Vattavila, Vellayani, Nemom (PO)",
                    addressLocality: "Thiruvananthapuram",
                    addressRegion: "Kerala",
                    postalCode: "695020",
                    addressCountry: "IN",
                  },
                  areaServed: { "@type": "Country", name: "India" },
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+91-80758-73624",
                    email: "info.voiceofthevoiceless1@gmail.com",
                    contactType: "customer support",
                    areaServed: "IN",
                    availableLanguage: ["English", "Malayalam"],
                  },
                  sameAs: [
                    "https://www.facebook.com/voice__of_the__voiceless",
                    "https://www.instagram.com/voice__of_the__voiceless",
                    "https://www.youtube.com/@voice__of_the__voiceless",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: "Voice of the Voiceless",
                  description:
                    "Kerala-based nonprofit helping people in need through compassion, awareness, and action.",
                  publisher: { "@id": `${SITE_URL}/#organization` },
                  inLanguage: "en-IN",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
