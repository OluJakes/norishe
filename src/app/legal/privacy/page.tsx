import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Norishé's privacy policy — how we collect, use, and protect your personal and health information, in line with the Nigeria Data Protection Act (NDPA/NDPR).",
  alternates: { canonical: "/legal/privacy" },
};

export default async function PrivacyPage() {
  const settings = await getSettings();
  return (
    <section className="bg-ivory pt-40 pb-24">
      <Container className="max-w-3xl">
        <h1 className="font-serif text-4xl text-forest">Privacy Policy</h1>
        <p className="mt-3 text-sm text-charcoal/50">Last updated: {new Date().getFullYear()}</p>

        <div className="prose-nrs mt-10 space-y-6 text-sm leading-relaxed text-charcoal/75">
          <p>
            Norishé ("we", "us", "our") is committed to protecting your privacy in accordance with the Nigeria Data
            Protection Act 2023 (NDPA) and the Nigeria Data Protection Regulation (NDPR). This policy explains what
            information we collect, why, and how we protect it.
          </p>

          <h2 className="font-serif text-xl text-forest">Information We Collect</h2>
          <p>
            When you enroll with Norishé, we collect personal information (name, contact details, date of birth,
            occupation, address), and — because personalized nutrition requires it — sensitive health information
            (height, weight, medical conditions, medications, allergies, and related lifestyle details).
          </p>

          <h2 className="font-serif text-xl text-forest">How We Use Your Information</h2>
          <p>
            We use your information to build and deliver your personalized meal recommendation, manage your
            subscription and deliveries, communicate with you about your plan, and — where you've consented —
            share promotions and wellness updates. We do not sell your personal data.
          </p>

          <h2 className="font-serif text-xl text-forest">Health Data Protection</h2>
          <p>
            Health-profile information is treated as sensitive personal data. Access is restricted to authorized
            Norishé staff who need it to prepare your recommendation, and it is never exposed through any public
            page or API.
          </p>

          <h2 className="font-serif text-xl text-forest">Your Rights</h2>
          <p>
            Under the NDPA, you have the right to access, correct, or request deletion of your personal data, and
            to withdraw consent to marketing communications at any time. Contact {settings.email} to exercise
            these rights.
          </p>

          <h2 className="font-serif text-xl text-forest">Data Retention & Security</h2>
          <p>
            We retain your information only as long as necessary to provide our services or as required by law,
            and apply reasonable technical and organizational measures to protect it against unauthorized access.
          </p>

          <h2 className="font-serif text-xl text-forest">Contact Us</h2>
          <p>Questions about this policy? Reach us at {settings.email} or {settings.phone}.</p>

          <p className="text-xs text-charcoal/40">
            This policy is provided as general guidance and should be reviewed by qualified legal counsel before
            publication, particularly regarding NDPA compliance for health data processing.
          </p>
        </div>
      </Container>
    </section>
  );
}
