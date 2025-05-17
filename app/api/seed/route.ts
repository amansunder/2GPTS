// app/api/seed/route.ts

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const gpts = [
      {
        id: 'gpt-001',
        name: 'Financial Coach GPT',
        description: 'Helps users plan finances using AI.',
        systemPrompt: 'You are a financial coach.',
        isPremium: false,
        category: 'Finance',
        modelProvider: 'OpenAI',
        thumbnail: '/thumbnails/finance.png',
        createdBy: 'admin@example.com' // Replace with a valid user ID or email from your User model
      },
      {
        id: 'gpt-002',
        name: 'Immigration GPT',
        description: 'Guides users through immigration questions.',
        systemPrompt: 'You are an immigration advisor.',
        isPremium: false,
        category: 'Legal',
        modelProvider: 'OpenAI',
        thumbnail: '/thumbnails/immigration.png',
        createdBy: 'admin@example.com'
      },
      {
        id: 'gpt-003',
        name: 'Accreditation GPT',
        description: 'Helps universities with accreditation processes.',
        systemPrompt: 'You help write accreditation reports.',
        isPremium: true,
        category: 'Education',
        modelProvider: 'Anthropic',
        thumbnail: '/thumbnails/accreditation.png',
        createdBy: 'admin@example.com'
      }
    ]

    for (const gpt of gpts) {
      await prisma.gPT.upsert({
        where: { id: gpt.id },
        update: gpt,
        create: gpt,
      })
    }

    return NextResponse.json({ status: 'success', count: gpts.length })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }
}
