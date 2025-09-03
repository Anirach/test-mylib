import { PrismaClient, BookStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create categories
  const designCategory = await prisma.category.upsert({
    where: { name: 'Design' },
    update: {},
    create: {
      name: 'Design',
      description: 'Books about design, typography, and visual arts'
    }
  })

  const architectureCategory = await prisma.category.upsert({
    where: { name: 'Architecture' },
    update: {},
    create: {
      name: 'Architecture',
      description: 'Books about architecture and urban planning'
    }
  })

  const programmingCategory = await prisma.category.upsert({
    where: { name: 'Programming' },
    update: {},
    create: {
      name: 'Programming',
      description: 'Books about programming and software development'
    }
  })

  // Create sample books
  const book1 = await prisma.book.upsert({
    where: { isbn: '978-0-123456-78-9' },
    update: {},
    create: {
      title: 'The Elegance of Typography',
      author: 'Marcus Reed',
      isbn: '978-0-123456-78-9',
      genre: 'design',
      description: 'A comprehensive guide to the art and science of typography in modern design.',
      coverImageUrl: '/uploads/covers/book-cover-1.jpg',
      status: BookStatus.OWNED,
      categoryId: designCategory.id
    }
  })

  const book2 = await prisma.book.upsert({
    where: { isbn: '978-0-987654-32-1' },
    update: {},
    create: {
      title: 'Modern Architecture',
      author: 'Sarah Johnson',
      isbn: '978-0-987654-32-1',
      genre: 'architecture',
      description: 'Exploring contemporary architectural movements and their impact on urban design.',
      coverImageUrl: '/uploads/covers/book-cover-2.jpg',
      status: BookStatus.LENT,
      categoryId: architectureCategory.id
    }
  })

  const book3 = await prisma.book.upsert({
    where: { isbn: '978-0-456789-01-2' },
    update: {},
    create: {
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      isbn: '978-0-456789-01-2',
      genre: 'programming',
      description: 'Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad.',
      coverImageUrl: '/uploads/covers/book-cover-3.jpg',
      status: BookStatus.WISHLIST,
      categoryId: programmingCategory.id
    }
  })

  // Create lending info for the lent book
  await prisma.lendingInfo.upsert({
    where: { id: 'sample-lending-1' },
    update: {},
    create: {
      id: 'sample-lending-1',
      bookId: book2.id,
      borrowerName: 'Alice Thompson',
      borrowerContact: 'alice@example.com',
      dateLent: new Date('2024-08-01'),
      expectedReturn: new Date('2024-09-01'),
      isReturned: false
    }
  })

  // Create a default admin user
  await prisma.user.upsert({
    where: { email: 'admin@bookmanager.com' },
    update: {},
    create: {
      email: 'admin@bookmanager.com',
      name: 'Admin User',
      password: 'admin123', // In real app, this should be hashed
      role: 'ADMIN'
    }
  })

  console.log('✅ Database seeding completed successfully!')
  console.log(`📚 Created ${await prisma.book.count()} books`)
  console.log(`📂 Created ${await prisma.category.count()} categories`)
  console.log(`📋 Created ${await prisma.lendingInfo.count()} lending records`)
  console.log(`👤 Created ${await prisma.user.count()} users`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
