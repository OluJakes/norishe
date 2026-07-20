"use client";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ phone = "2347061808293" }: { phone?: string }) {
  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent("Hi Norishé! I'd like to know more about your meal plans.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Norishé on WhatsApp"
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-gold shadow-soft ring-1 ring-gold/30 transition-transform hover:scale-105 md:bottom-6"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
    </a>
  );
}
