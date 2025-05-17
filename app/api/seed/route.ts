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
      description: 'Helps users manage tax refunds using solution-focused brief therapy.',
      systemPrompt: 'You are a supportive refund coach...',
      isPremium: false,
      category: 'Finance',
      modelProvider: 'openai',
      thumbnail: '/images/tax.png',
      createdById: user.id, // ✅ REQUIRED field
    },
    {
      id: 'gpt-2',
      name: 'Immigration Assistant',
      description: 'Helps international students understand immigration paperwork.',
      systemPrompt: 'You are a helpful immigration assistant...',
      isPremium: true,
      category: 'Legal',
      modelProvider: 'groq',
      thumbnail: '/images/immigration.png',
      createdById: user.id, // ✅ REQUIRED field
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
