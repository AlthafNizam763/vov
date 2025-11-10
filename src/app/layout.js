import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Voice of the Voiceless | Empowering the Unheard",
  description:
    "Voice of the Voiceless is a platform dedicated to helping those in need through compassion, awareness, and action. Join us to make a difference.",
  keywords: [
    "Voice of the Voiceless",
    "NGO",
    "charity",
    "Kerala",
    "social work",
    "donation",
    "humanitarian",
    "volunteering",
  ],
  openGraph: {
    title: "Voice of the Voiceless",
    description:
      "Let’s donate now to help fellow humans in need. Together, we can give voice to the voiceless.",
    url: "https://www.voiceofthevoiceless.co.in",
    siteName: "Voice of the Voiceless",
    images: [
      {
        url: "https://www.voiceofthevoiceless.co.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Voice of the Voiceless Banner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice of the Voiceless",
    description:
      "Join us in empowering the unheard through compassion and action.",
    images: ["https://www.voiceofthevoiceless.co.in/og-image.png"],
  },
  metadataBase: new URL("https://www.voiceofthevoiceless.co.in"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Structured Data for SEO (Organization Schema) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Voice of the Voiceless",
              url: "https://www.voiceofthevoiceless.co.in",
              logo: "https://www.voiceofthevoiceless.co.in/vov-logo.png",
              sameAs: [
                "https://www.facebook.com/voice__of_the__voiceless",
                "https://www.instagram.com/voice__of_the__voiceless",
                "https://www.youtube.com/@voice__of_the__voiceless",
              ],
              description:
                "Voice of the Voiceless is a humanitarian initiative to support people in need through awareness, aid, and action.",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
