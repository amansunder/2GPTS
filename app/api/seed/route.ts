import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const prisma = new PrismaClient()

  const adminEmail = process.env.ADMIN_EMAIL || 'contact@2gpts.com'

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'SUPER_ADMIN' },
    create: {
      email: adminEmail,
      name: 'Platform Owner',
      role: 'SUPER_ADMIN',
    },
  })

  const gpts = [
    {
      id: 'gpt-1',
      name: 'Tax Refund Coach',
      description: 'Guides users to make smart decisions with tax refunds using SFBT.',
      systemPrompt: 'You are a supportive, positive financial coach...',
      isPremium: false,
      category: 'Finance',
      modelProvider: 'openai',
      thumbnail: '/images/tax-refund.png',
      createdById: user.id, // ✅ now required
    },
    {
      id: 'gpt-2',
      name: 'Immigration Advisor',
      description: 'Helps international students navigate immigration paperwork.',
      systemPrompt: 'You are a friendly immigration assistant...',
      isPremium: true,
      category: 'Legal',
      modelProvider: 'groq',
      thumbnail: '/images/immigration.png',
      createdById: user.id, // ✅ now required
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
