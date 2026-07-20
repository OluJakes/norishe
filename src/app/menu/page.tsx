import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MenuGallery } from "@/components/MenuGallery";
import { getMenuItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Menu & Gallery",
  description: "Browse the Norishé dish gallery — see calories, protein, and which meal plan each dish belongs to.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const items = await getMenuItems();
  return (
    <>
      <section className="bg-forest-gradient pt-40 pb-24 text-center">
        <Container>
          <SectionLabel light center>Menu & Gallery</SectionLabel>
          <h1 className="font-serif text-4xl text-ivory sm:text-5xl">A Taste of Norishé</h1>
        </Container>
      </section>
      <section className="bg-ivory py-20">
        <Container>
          <MenuGallery items={items as any} />
        </Container>
      </section>
    </>
  );
}
