import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  type: z.enum(["pageview", "cta_click"]),
  path: z.string(),
  label: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    await prisma.analyticsEvent.create({ data: parsed.data });
    return NextResponse.json({ ok: true });
  } catch {
    // Analytics must never break the user experience — fail silently.
    return NextResponse.json({ ok: false });
  }
}
