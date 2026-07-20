import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCSV } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "";

  const leads = await prisma.lead.findMany({
    where: type ? { type: type as any } : {},
    orderBy: { createdAt: "desc" },
  });

  const csv = toCSV(
    leads.map((l: any) => ({
      id: l.id,
      createdAt: l.createdAt.toISOString(),
      type: l.type,
      status: l.status,
      name: l.name,
      email: l.email,
      phone: l.phone,
      company: l.company,
      message: l.message,
    }))
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="norishe-leads-${Date.now()}.csv"`,
    },
  });
}
