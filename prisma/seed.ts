import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
      name: 'Tax Refund Advisor GPT',
      systemPrompt: 'You are a helpful GPT that gives personalized refund advice using solution-focused brief therapy principles...',
      isPremium: false,
      createdById: user.id,
    },
    {
      name: 'Immigration Helper GPT',
      systemPrompt: 'You are a legal assistant helping international students understand their visa options clearly...',
      isPremium: true,
      createdById: user.id,
    },
    {
      name: 'AI Career Coach',
      systemPrompt: 'You help young adults and students build confidence and set goals toward a career path...',
      isPremium: false,
      createdById: user.id,
    },
  ]

  for (const gpt of gpts) {
    await prisma.gPT.upsert({
      where: { name: gpt.name },
      update: gpt,
      create: gpt,
    })
  }

  console.log(`Seeded ${gpts.length} GPTs and super admin: ${user.email}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(() => {
  prisma.$disconnect()
})
