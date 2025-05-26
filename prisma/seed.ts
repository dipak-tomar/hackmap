import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@example.com' },
    update: {},
    create: {
      email: 'organizer@example.com',
      name: 'Sample Organizer',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptpT1/GxEPL5u8LUu', // password123
      bio: 'Experienced hackathon organizer passionate about innovation and technology.',
      skills: JSON.stringify(['Event Management', 'Community Building', 'Tech Leadership']),
    },
  })

  // Create sample participants for testing
  const participants = [
    {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptpT1/GxEPL5u8LUu', // password123
      bio: 'Full-stack developer with a passion for AI and machine learning.',
      skills: JSON.stringify(['React', 'Node.js', 'Python', 'TensorFlow', 'AWS']),
    },
    {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptpT1/GxEPL5u8LUu', // password123
      bio: 'UI/UX designer and frontend developer focused on creating amazing user experiences.',
      skills: JSON.stringify(['Figma', 'React', 'TypeScript', 'Tailwind CSS', 'Design Systems']),
    },
    {
      email: 'charlie@example.com',
      name: 'Charlie Davis',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptpT1/GxEPL5u8LUu', // password123
      bio: 'Blockchain developer and Web3 enthusiast building the future of decentralized apps.',
      skills: JSON.stringify(['Solidity', 'Web3.js', 'React', 'Smart Contracts', 'DeFi']),
    },
  ]

  for (const participant of participants) {
    await prisma.user.upsert({
      where: { email: participant.email },
      update: {},
      create: participant,
    })
  }

  // Create sample hackathons with future dates
  const now = new Date()
  const hackathons = [
    {
      title: 'AI Innovation Challenge 2024',
      description: 'Build the next generation of AI-powered applications',
      theme: 'ai',
      startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      endDate: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000), // 32 days from now
      registrationDeadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
      maxTeamSize: 4,
      prizes: JSON.stringify(['$10,000 First Prize', '$5,000 Second Prize', '$2,500 Third Prize']),
      tags: JSON.stringify(['AI', 'Machine Learning', 'Innovation']),
      organizerId: organizer.id,
    },
    {
      title: 'Web3 Builder Hackathon',
      description: 'Create decentralized applications that change the world',
      theme: 'web3',
      startDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      endDate: new Date(now.getTime() + 62 * 24 * 60 * 60 * 1000), // 62 days from now
      registrationDeadline: new Date(now.getTime() + 55 * 24 * 60 * 60 * 1000), // 55 days from now
      maxTeamSize: 5,
      prizes: JSON.stringify(['$15,000 First Prize', '$7,500 Second Prize', '$3,000 Third Prize']),
      tags: JSON.stringify(['Blockchain', 'DeFi', 'NFT', 'Smart Contracts']),
      organizerId: organizer.id,
    },
    {
      title: 'FinTech Revolution',
      description: 'Revolutionize financial services with cutting-edge technology',
      theme: 'fintech',
      startDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      endDate: new Date(now.getTime() + 92 * 24 * 60 * 60 * 1000), // 92 days from now
      registrationDeadline: new Date(now.getTime() + 85 * 24 * 60 * 60 * 1000), // 85 days from now
      maxTeamSize: 4,
      prizes: JSON.stringify(['$12,000 First Prize', '$6,000 Second Prize', '$3,000 Third Prize']),
      tags: JSON.stringify(['FinTech', 'Banking', 'Payments', 'Investment']),
      organizerId: organizer.id,
    },
  ]

  for (const hackathon of hackathons) {
    const existing = await prisma.hackathon.findFirst({
      where: { title: hackathon.title },
    })
    
    if (!existing) {
      await prisma.hackathon.create({
        data: hackathon,
      })
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 