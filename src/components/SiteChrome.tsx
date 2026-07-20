"use client";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ExitIntentModal } from "@/components/ExitIntentModal";

type SiteSettings = {
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  address: string;
  announcementBanner?: string | null;
};

export function SiteChrome({
  children,
  settings,
  footerTagline,
  footerCredit,
}: {
  children: React.ReactNode;
  settings: SiteSettings;
  footerTagline: string;
  footerCredit: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {settings.announcementBanner && (
        <div className="relative z-[60] bg-gold-gradient px-4 py-2 text-center text-xs font-semibold text-forest-dark">
          {settings.announcementBanner}
        </div>
      )}
      <Header />
      <main className="pb-16 md:pb-0">{children}</main>
      <Footer settings={settings} tagline={footerTagline} credit={footerCredit} />
      <WhatsAppButton phone={settings.whatsapp} />
      <ExitIntentModal />
    </>
  );
}
