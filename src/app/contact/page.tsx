import type { Metadata } from "next";
import { Phone, Mail, Instagram, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Norishé — phone, email, Instagram, and WhatsApp. Based in Maitama, Abuja, serving Abuja and select delivery zones across Nigeria.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();
  const phoneHref = `tel:+${settings.phone.replace(/[^\d]/g, "")}`;

  return (
    <>
      <section className="bg-forest-gradient pt-40 pb-24 text-center">
        <Container>
          <SectionLabel light center>Contact</SectionLabel>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">We'd Love to Hear From You</h1>
        </Container>
      </section>

      <section className="bg-cream py-20">
        <Container className="grid gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionLabel>Get In Touch</SectionLabel>
            <div className="space-y-5">
              <a href={phoneHref} className="flex items-center gap-3 text-charcoal/80 hover:text-forest">
                <Phone className="h-5 w-5 text-gold" /> {settings.phone}
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-charcoal/80 hover:text-forest">
                <Mail className="h-5 w-5 text-gold" /> {settings.email}
              </a>
              <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-charcoal/80 hover:text-forest">
                <Instagram className="h-5 w-5 text-gold" /> @{settings.instagram}
              </a>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-charcoal/80 hover:text-forest"
              >
                <MessageCircle className="h-5 w-5 text-gold" /> Chat on WhatsApp
              </a>
              <p className="flex items-start gap-3 text-charcoal/70">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
                {settings.address}
              </p>
              <p className="flex items-start gap-3 text-charcoal/70">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
                {settings.deliveryNote}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
