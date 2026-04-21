import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Note: In production, this would generate a Stripe Checkout Session URL
    // and return it to the client. Since this is the mock flow, we just upgrade
    // the user instantly.

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        plan: "PRO",
      } as Record<string, string>,
    });

    return NextResponse.json({ ok: true, message: "Upgraded to Foodipa+ PRO successfully!" });
  } catch (error) {
    console.error("[Mock Checkout Error]", error);
    return NextResponse.json({ error: "Failed to process upgrade." }, { status: 500 });
  }
}