import type { Metadata } from "next";
import "./globals.css";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { AnalyticsTracker } from "@/components/Analytics";
import { SiteChrome } from "@/components/SiteChrome";
import { getSettings, getContent } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://norishe.vip";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Norishé — Premium Healthy Meals, Delivered with Intention",
    template: "%s | Norishé",
  },
  description:
    "Norishé is Nigeria's premium healthy meal delivery brand — freshly prepared, perfectly portioned meals for professionals, families, and everyone in between. Nourish. Power. Thrive.",
  keywords: [
    "healthy meal delivery Nigeria",
    "meal plans Abuja",
    "executive meal plan",
    "fat loss meal plan Nigeria",
    "corporate meal delivery",
    "Norishé",
  ],
  openGraph: {
    title: "Norishé — Premium Healthy Meals, Delivered with Intention",
    description:
      "Freshly prepared, perfectly portioned meals for professionals, families, and everyone in between.",
    url: SITE_URL,
    siteName: "Norishé",
    images: ["/images/packaging-branded-container.jpg"],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Norishé — Premium Healthy Meals, Delivered with Intention",
    description: "Nourish. Power. Thrive.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, content] = await Promise.all([getSettings(), getContent()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Norishé",
    image: `${SITE_URL}/images/packaging-branded-container.jpg`,
    "@id": SITE_URL,
    url: SITE_URL,
    telephone: settings.phone,
    priceRange: "₦₦₦",
    address: {
      "@type": "PostalAddress",
      streetAddress: "15 Kainji Crescent, off Lake Chad Crescent",
      addressLocality: "Maitama, Abuja",
      addressRegion: "FCT",
      addressCountry: "NG",
    },
    sameAs: [`https://instagram.com/${settings.instagram}`],
  };

  return (
    <html lang="en-NG">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <AnalyticsTracker />
        <SiteChrome settings={settings} footerTagline={content.footer_tagline} footerCredit={content.footer_credit}>
          {children}
        </SiteChrome>
        <MobileBottomBar />
      </body>
    </html>
  );
}
