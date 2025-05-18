import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Ensure 'system' user exists
    await prisma.user.upsert({
      where: { id: 'system' },
      update: {},
      create: {
        id: 'system',
        name: 'System',
        email: 'system@2gpts.ai',
      },
    });

    // 2. Seed GPTs one by one
    const gpts = [
      {
        id: '1',
        name: 'TaxBot',
        description: 'Helps low-income users with tax refund goals',
        systemPrompt: 'You are TaxBot...',
        isPremium: false,
        category: 'Finance',
        modelProvider: 'OpenAI',
        thumbnail: '/thumbnails/tax.png',
        createdById: 'system',
      },
      {
        id: '2',
        name: 'Accreditor AI',
        description: 'Helps universities with accreditation documents',
        systemPrompt: 'You are Accreditor AI...',
        isPremium: true,
        category: 'Education',
        modelProvider: 'OpenAI',
        thumbnail: '/thumbnails/accreditation.png',
        createdById: 'system',
      },
    ];

    for (const gpt of gpts) {
      await prisma.gPT.upsert({
        where: { id: gpt.id },
        update: {},
        create: gpt,
      });
    }

    return NextResponse.json({ message: 'Seed successful' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
