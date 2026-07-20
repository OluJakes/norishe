"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return session;
}

async function logAction(action: string, detail?: string) {
  try {
    const session = await getServerSession(authOptions);
    const adminId = (session?.user as any)?.id;
    if (!adminId) return;
    await prisma.auditLog.create({ data: { adminId, action, detail } });
  } catch {
    /* audit logging must never block the primary action */
  }
}

// ---------- Enrollments ----------

export async function updateEnrollmentStatus(id: string, status: string) {
  await requireAdmin();
  await prisma.enrollment.update({ where: { id }, data: { status: status as any } });
  await logAction("enrollment.status_update", `${id} -> ${status}`);
  revalidatePath("/admin/enrollments");
  revalidatePath(`/admin/enrollments/${id}`);
}

export async function updateEnrollmentNotes(id: string, notes: string) {
  await requireAdmin();
  await prisma.enrollment.update({ where: { id }, data: { notes } });
  await logAction("enrollment.notes_update", id);
  revalidatePath(`/admin/enrollments/${id}`);
}

// ---------- Leads ----------

export async function updateLeadStatus(id: string, status: string) {
  await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { status: status as any } });
  await logAction("lead.status_update", `${id} -> ${status}`);
  revalidatePath("/admin/leads");
}

// ---------- Plans & Tiers ----------

export async function updatePlanDetails(
  planId: string,
  data: { name: string; tagline: string; description: string; active: boolean; popular: boolean }
) {
  await requireAdmin();
  await prisma.plan.update({ where: { id: planId }, data });
  await logAction("plan.update", planId);
  revalidatePath("/admin/plans");
  revalidatePath("/plans");
}

export async function addPlanTier(planId: string, data: { mealsPerWeek: number; billing: string; priceNaira: number }) {
  await requireAdmin();
  await prisma.planTier.create({ data: { planId, ...data } });
  await logAction("plan.tier_add", planId);
  revalidatePath("/admin/plans");
  revalidatePath("/plans");
}

export async function updatePlanTier(tierId: string, data: { priceNaira?: number; mealsPerWeek?: number; billing?: string; active?: boolean }) {
  await requireAdmin();
  await prisma.planTier.update({ where: { id: tierId }, data });
  await logAction("plan.tier_update", tierId);
  revalidatePath("/admin/plans");
  revalidatePath("/plans");
}

export async function deletePlanTier(tierId: string) {
  await requireAdmin();
  await prisma.planTier.delete({ where: { id: tierId } });
  await logAction("plan.tier_delete", tierId);
  revalidatePath("/admin/plans");
  revalidatePath("/plans");
}

// ---------- Menu Items ----------

export async function createMenuItem(data: { name: string; imageUrl?: string; calories: number; protein: number; planTags: string[] }) {
  await requireAdmin();
  await prisma.menuItem.create({
    data: { name: data.name, imageUrl: data.imageUrl, calories: data.calories, protein: data.protein, planTags: JSON.stringify(data.planTags) },
  });
  await logAction("menu.create", data.name);
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

export async function deleteMenuItem(id: string) {
  await requireAdmin();
  await prisma.menuItem.delete({ where: { id } });
  await logAction("menu.delete", id);
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

// ---------- Testimonials ----------

export async function createTestimonial(data: { name: string; role?: string; quote: string; rating: number }) {
  await requireAdmin();
  await prisma.testimonial.create({ data: { ...data, visible: true } });
  await logAction("testimonial.create", data.name);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialVisible(id: string, visible: boolean) {
  await requireAdmin();
  await prisma.testimonial.update({ where: { id }, data: { visible } });
  await logAction("testimonial.toggle", id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  await logAction("testimonial.delete", id);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

// ---------- Settings ----------

export async function updateSettings(data: {
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  address: string;
  deliveryNote: string;
  announcementBanner?: string;
}) {
  await requireAdmin();
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  await logAction("settings.update");
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}

// ---------- Site Content (marketing copy) ----------

export async function updateSiteContent(entries: { key: string; value: string }[]) {
  await requireAdmin();
  await Promise.all(
    entries.map((e) =>
      prisma.siteContent.upsert({
        where: { key: e.key },
        update: { value: e.value },
        create: { key: e.key, value: e.value },
      })
    )
  );
  await logAction("content.update", entries.map((e) => e.key).join(", "));
  // Site content touches nearly every public page — revalidate broadly.
  revalidatePath("/", "layout");
}

// ---------- FAQ ----------

export async function createFaqItem(data: { question: string; answer: string }) {
  await requireAdmin();
  const count = await prisma.faqItem.count();
  await prisma.faqItem.create({ data: { ...data, order: count, visible: true } });
  await logAction("faq.create", data.question);
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

export async function updateFaqItem(id: string, data: { question: string; answer: string }) {
  await requireAdmin();
  await prisma.faqItem.update({ where: { id }, data });
  await logAction("faq.update", id);
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

export async function toggleFaqVisible(id: string, visible: boolean) {
  await requireAdmin();
  await prisma.faqItem.update({ where: { id }, data: { visible } });
  await logAction("faq.toggle", id);
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

export async function deleteFaqItem(id: string) {
  await requireAdmin();
  await prisma.faqItem.delete({ where: { id } });
  await logAction("faq.delete", id);
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

// ---------- Subscriptions ----------

export async function createSubscription(data: {
  enrollmentId: string;
  planId: string;
  deliveryDays: string[];
  paymentStatus: string;
}) {
  await requireAdmin();
  await prisma.subscription.create({
    data: {
      enrollmentId: data.enrollmentId,
      planId: data.planId,
      deliveryDays: JSON.stringify(data.deliveryDays),
      paymentStatus: data.paymentStatus as any,
    },
  });
  await logAction("subscription.create", data.enrollmentId);
  revalidatePath("/admin/enrollments");
  revalidatePath("/admin/delivery");
}

export async function updateSubscriptionPayment(id: string, paymentStatus: string) {
  await requireAdmin();
  await prisma.subscription.update({ where: { id }, data: { paymentStatus: paymentStatus as any } });
  await logAction("subscription.payment_update", `${id} -> ${paymentStatus}`);
  revalidatePath("/admin/delivery");
}
