import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const prisma = new PrismaClient()

  const adminEmail = process.env.ADMIN_EMAIL || 'contact@2gpts.com'

  // Create or update the super admin user
  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'SUPER_ADMIN' },
    create: {
      email: adminEmail,
      name: 'Platform Owner',
      role: 'SUPER_ADMIN',
    },
  })

  // Seed GPTs with createdBy relation
  const gpts = [
    {
      id: 'gpt-1',
      name: 'Tax Refund Coach',
      description: 'Helps users manage tax refunds using solution-focused brief therapy.',
      systemPrompt: 'You are a supportive refund coach that helps people think positively and take action with their tax refund.',
      isPremium: false,
      category: 'Finance',
      modelProvider: 'openai',
      thumbnail: '/images/tax.png',
      createdBy: { connect: { id: user.id } }, // ✅ Required relation
    },
    {
      id: 'gpt-2',
      name: 'Immigration Assistant',
      description: 'Helps international students understand immigration paperwork.',
      systemPrompt: 'You are a helpful, friendly immigration assistant who can guide students through document requirements.',
      isPremium: true,
      category: 'Legal',
      modelProvider: 'groq',
      thumbnail: '/images/immigration.png',
      createdBy: { connect: { id: user.id } }, // ✅ Required relation
    }
  ]

  for (const gpt of gpts) {
    await prisma.gPT.upsert({
      where: { id: gpt.id },
      update: gpt,
      create: gpt,
    })
  }

  return NextResponse.json({
    message: `Seeded ${gpts.length} GPTs and super admin: ${user.email}`,
  })
}
