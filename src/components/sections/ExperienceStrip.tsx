import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

export function ExperienceStrip({ quote }: { quote: string }) {
  return (
    <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
      <Image
        src="/images/dish-containers-top.jpg"
        alt="Norishé meal containers, prepared with care, balance and intention"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-forest-dark/50" />
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <Reveal>
          <p className="max-w-2xl text-center font-serif text-2xl italic text-ivory sm:text-3xl">
            "{quote}"
          </p>
        </Reveal>
      </div>
    </section>
  );
}
