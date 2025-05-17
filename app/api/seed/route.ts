// /app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const gpts = [
      {
        id: '1',
        name: 'Tax Refund Coach',
        description: 'Helps low-income filers set savings goals using behavioral nudges.',
        systemPrompt: 'You are a tax refund goals coach...',
        isPremium: false,
        category: 'Finance',
        modelProvider: 'OpenAI',
        thumbnail: '/thumbnails/tax.png',
        createdBy: 'system', // Replace with actual user ID logic later if needed
      },
      {
        id: '2',
        name: 'Accreditation Assistant',
        description: 'Helps colleges draft assurance arguments for accreditors.',
        systemPrompt: 'You are an accreditation document assistant...',
        isPremium: true,
        category: 'Education',
        modelProvider: 'OpenAI',
        thumbnail: '/thumbnails/accreditation.png',
        createdBy: 'system',
      },
      {
        id: '3',
        name: 'Food Safety GPT',
        description: 'Supports QA teams in using shelf-life modeling with clean label ingredients.',
        systemPrompt: 'You are a food microbiology modeling advisor...',
        isPremium: true,
        category: 'Food Science',
        modelProvider: 'OpenAI',
        thumbnail: '/thumbnails/foodsafety.png',
        createdBy: 'system',
      },
    ];

    for (const gpt of gpts) {
      await prisma.gPT.upsert({
        where: { id: gpt.id },
        update: gpt,
        create: gpt,
      });
    }

    return NextResponse.json({ message: 'Seed successful', count: gpts.length });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    
  }
}
