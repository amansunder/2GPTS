import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
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
      },
    ];

    for (const gpt of gpts) {
      await prisma.gPT.upsert({
        where: { id: gpt.id },
        update: gpt,
        create: gpt,
      });
    }

    return NextResponse.json({ message: 'Seeding complete.' });
  } catch (error) {
    console.error('Seeding error:', error);
    return new NextResponse('Error seeding GPTs', { status: 500 });
  }
}
