// Triggering deploy with a comment
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    // 1. Create or update the 'system' user based on email
    const systemUser = await prisma.user.upsert({
      where: { email: 'system@2gpts.ai' },
      update: {},
      create: {
        name: 'System',
        email: 'system@2gpts.ai',
      },
    });

    // 2. Then insert GPTs one by one, using the generated user ID
    const gptsToSeed = [
      {
        id: '1',
        name: 'TaxBot',
        description: 'Helps low-income users with tax refund goals',
        systemPrompt: 'You are TaxBot...',
        isPremium: false,
        category: 'Finance',
        modelProvider: 'OpenAI',
        thumbnail: '/thumbnails/tax.png',
        createdById: systemUser.id,
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
        createdById: systemUser.id,
      },
    ];

    for (const gpt of gptsToSeed) {
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
