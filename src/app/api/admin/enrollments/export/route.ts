import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCSV } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";

  const enrollments = await prisma.enrollment.findMany({
    where: {
      AND: [
        status ? { status: status as any } : {},
        q
          ? { OR: [{ fullName: { contains: q } }, { email: { contains: q } }, { city: { contains: q } }] }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = enrollments.map((e: any) => ({
    id: e.id,
    createdAt: e.createdAt.toISOString(),
    status: e.status,
    fullName: e.fullName,
    email: e.email,
    phone: e.phone,
    city: e.city,
    state: e.state,
    interestedPlan: e.interestedPlan,
    mealsNeeded: e.mealsNeeded,
    deliveryDays: e.deliveryDays,
    deliveryAddress: e.deliveryAddress,
  }));

  const csv = toCSV(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="norishe-enrollments-${Date.now()}.csv"`,
    },
  });
}
