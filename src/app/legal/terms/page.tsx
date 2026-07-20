import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Norishé's terms of service governing meal plan subscriptions, deliveries, payments, and use of this website.",
  alternates: { canonical: "/legal/terms" },
};

export default async function TermsPage() {
  const settings = await getSettings();
  return (
    <section className="bg-ivory pt-40 pb-24">
      <Container className="max-w-3xl">
        <h1 className="font-serif text-4xl text-forest">Terms of Service</h1>
        <p className="mt-3 text-sm text-charcoal/50">Last updated: {new Date().getFullYear()}</p>

        <div className="prose-nrs mt-10 space-y-6 text-sm leading-relaxed text-charcoal/75">
          <h2 className="font-serif text-xl text-forest">1. Our Service</h2>
          <p>Norishé provides premium prepared-meal subscriptions delivered across our designated delivery zones in Nigeria, based on the plan and preferences you select at enrollment.</p>

          <h2 className="font-serif text-xl text-forest">2. Enrollment & Accuracy</h2>
          <p>You agree to provide accurate personal and health information during enrollment. Norishé's meal recommendations are based on this information and are provided for general wellness purposes — not as medical advice.</p>

          <h2 className="font-serif text-xl text-forest">3. Payments</h2>
          <p>Subscriptions may be paid via bank transfer, on delivery, or card payment (where enabled). Pricing for each plan and tier is confirmed at enrollment and may be updated from time to time.</p>

          <h2 className="font-serif text-xl text-forest">4. Delivery</h2>
          <p>Delivery days and times are scheduled according to your plan and location. Norishé is not liable for delays caused by circumstances outside our reasonable control.</p>

          <h2 className="font-serif text-xl text-forest">5. Pausing & Cancellation</h2>
          <p>You may pause or cancel your subscription by contacting our team at least 48 hours before your next scheduled delivery.</p>

          <h2 className="font-serif text-xl text-forest">6. Food Safety</h2>
          <p>Meals are prepared under hygienic conditions and delivered in tamper-evident, sealed packaging. Please follow the storage and reheating guidance provided with each delivery.</p>

          <h2 className="font-serif text-xl text-forest">7. Not Medical Advice</h2>
          <p>Norishé meal plans support general wellness goals. If you have a medical condition, please consult a qualified healthcare professional before starting or changing your diet.</p>

          <h2 className="font-serif text-xl text-forest">8. Contact</h2>
          <p>Questions about these terms? Reach us at {settings.email} or {settings.phone}.</p>

          <p className="text-xs text-charcoal/40">
            This document is provided as general guidance and should be reviewed by qualified legal counsel before publication.
          </p>
        </div>
      </Container>
    </section>
  );
}
