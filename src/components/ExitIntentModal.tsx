"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { LeafMark } from "@/components/icons/Leaf";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return; // desktop only
    if (sessionStorage.getItem("nrs_exit_shown")) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        setOpen(true);
        sessionStorage.setItem("nrs_exit_shown", "1");
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    }
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "EXIT_INTENT", email }),
      });
      setStatus("done");
    } catch {
      setStatus("idle");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-dark/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl2 bg-ivory p-8 text-center shadow-soft">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-charcoal/50 hover:bg-forest/5"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <LeafMark className="mx-auto mb-3 h-8 w-14 text-gold" />
        {status === "done" ? (
          <>
            <h3 className="font-serif text-2xl text-forest">Check your inbox!</h3>
            <p className="mt-2 text-sm text-charcoal/70">
              Your free 7-Day Healthy Eating Guide is on its way.
            </p>
          </>
        ) : (
          <>
            <h3 className="font-serif text-2xl text-forest">Wait — before you go</h3>
            <p className="mt-2 text-sm text-charcoal/70">
              Grab our free 7-Day Healthy Eating Guide, crafted by the Norishé kitchen team.
            </p>
            <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full rounded-full border border-forest/15 bg-white px-5 py-3 text-sm focus:border-gold focus:outline-none"
              />
              <button type="submit" className="btn-gold w-full" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send Me the Guide"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
