import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail, adminNotificationEmail } from "@/lib/email";

const leadSchema = z.object({
  type: z.enum(["NEWSLETTER", "CONTACT", "CORPORATE", "EXIT_INTENT"]),
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
  meta: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission", issues: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    const lead = await prisma.lead.create({ data });

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "hello@norishe.vip";
    await sendEmail({
      to: adminEmail,
      subject: `New ${data.type.toLowerCase()} lead — Norishé`,
      html: adminNotificationEmail(`New ${data.type} Lead`, data),
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (err) {
    console.error("[api/leads] error", err);
    return NextResponse.json(
      { error: "We couldn't process this right now. Please try again shortly." },
      { status: 503 }
    );
  }
}
