import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma'; // adjust this path if needed

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
          createdBy: 'system',
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
          createdBy: 'system',
        },
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({ message: 'Seed successful' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
