import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Seed Institution
    const institution = await prisma.institution.upsert({
      where: { slug: "2gpts" },
      update: {},
      create: {
        name: "2GPTS University",
        slug: "2gpts",
        domain: "2gpts.com",
      },
    });

    // 2. Seed Admin User
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@2gpts.com" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@2gpts.com",
        role: "ADMIN",
        institutionId: institution.id,
      },
    });

    // 3. Seed Subscriber User
    const subscriberUser = await prisma.user.upsert({
      where: { email: "user@2gpts.com" },
      update: {},
      create: {
        name: "Subscriber User",
        email: "user@2gpts.com",
        role: "SUBSCRIBER",
        institutionId: institution.id,
      },
    });

    // 4. Seed GPTs
    const gptsToSeed = [
      {
        id: "gpt-1",
        name: "TaxBot",
        description: "Helps low-income users with tax refund goals",
        systemPrompt: "You are TaxBot...",
        isPremium: false,
        category: "Finance",
        modelProvider: "OpenAI",
        thumbnail: "/thumbnails/tax.png",
        institutionId: institution.id,
        creatorId: adminUser.id,
      },
      {
        id: "gpt-2",
        name: "Accreditor AI",
        description: "Helps universities with accreditation documents",
        systemPrompt: "You are Accreditor AI...",
        isPremium: true,
        category: "Education",
        modelProvider: "OpenAI",
        thumbnail: "/thumbnails/accreditation.png",
        institutionId: institution.id,
        creatorId: adminUser.id,
      },
    ];

    for (const gpt of gptsToSeed) {
      await prisma.gPT.upsert({
        where: { id: gpt.id },
        update: {},
        create: gpt,
      });
    }

    return NextResponse.json({ message: "Seed successful" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
