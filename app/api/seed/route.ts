import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    await prisma.gPT.createMany({
      data: [
        {
          id: '1',
          name: 'TaxBot',
          description: 'Helps low-income users with tax refund goals',
          systemPrompt: 'You are TaxBot...',
          isPremium: false,
          category: 'Finance',
          modelProvider: 'OpenAI',
          thumbnail: '/thumbnails/tax.png',
          createdById: 'system'
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
          createdById: 'system'
        }
      ],
      skipDuplicates: true
    });

    return NextResponse.json({ message: 'Seed successful' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
