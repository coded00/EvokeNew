import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default categories
  const categories = [
    {
      name: 'Music',
      description: 'Live music events, concerts, and performances',
      icon: '🎵',
      color: '#FF6B6B',
    },
    {
      name: 'Technology',
      description: 'Tech conferences, hackathons, and workshops',
      icon: '💻',
      color: '#4ECDC4',
    },
    {
      name: 'Business',
      description: 'Business conferences, networking events, and seminars',
      icon: '💼',
      color: '#45B7D1',
    },
    {
      name: 'Sports',
      description: 'Sports events, tournaments, and competitions',
      icon: '⚽',
      color: '#96CEB4',
    },
    {
      name: 'Arts & Culture',
      description: 'Art exhibitions, theater, and cultural events',
      icon: '🎨',
      color: '#FFEAA7',
    },
    {
      name: 'Food & Drink',
      description: 'Food festivals, wine tastings, and culinary events',
      icon: '🍽️',
      color: '#DDA0DD',
    },
    {
      name: 'Education',
      description: 'Educational workshops, courses, and training',
      icon: '📚',
      color: '#98D8C8',
    },
    {
      name: 'Health & Wellness',
      description: 'Fitness events, wellness retreats, and health seminars',
      icon: '🧘',
      color: '#F7DC6F',
    },
  ];

  console.log('Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Create default venues
  const venues = [
    {
      name: 'Downtown Convention Center',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      capacity: 1000,
      description: 'Modern convention center in the heart of downtown',
      website: 'https://downtownconvention.com',
      phone: '+1-555-0123',
      email: 'info@downtownconvention.com',
    },
    {
      name: 'Riverside Park',
      address: '456 Riverside Drive',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      postalCode: '90210',
      capacity: 500,
      description: 'Beautiful outdoor venue with river views',
      website: 'https://riversidepark.com',
      phone: '+1-555-0456',
      email: 'events@riversidepark.com',
    },
    {
      name: 'Tech Hub Innovation Center',
      address: '789 Innovation Way',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94105',
      capacity: 200,
      description: 'State-of-the-art tech event space',
      website: 'https://techhub.com',
      phone: '+1-555-0789',
      email: 'hello@techhub.com',
    },
  ];

  console.log('Creating venues...');
  for (const venue of venues) {
    await prisma.venue.upsert({
      where: { name: venue.name },
      update: {},
      create: venue,
    });
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@evoke.com' },
    update: {},
    create: {
      email: 'admin@evoke.com',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      passwordHash: adminPassword,
      isVerified: true,
      role: UserRole.ADMIN,
    },
  });

  // Create organizer user
  const organizerPassword = await bcrypt.hash('organizer123', 12);
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@evoke.com' },
    update: {},
    create: {
      email: 'organizer@evoke.com',
      username: 'organizer',
      firstName: 'Event',
      lastName: 'Organizer',
      passwordHash: organizerPassword,
      isVerified: true,
      role: UserRole.ORGANIZER,
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@evoke.com' },
    update: {},
    create: {
      email: 'user@evoke.com',
      username: 'user',
      firstName: 'Regular',
      lastName: 'User',
      passwordHash: userPassword,
      isVerified: true,
      role: UserRole.USER,
    },
  });

  // Get venues and categories for events
  const downtownVenue = await prisma.venue.findUnique({
    where: { name: 'Downtown Convention Center' },
  });

  const musicCategory = await prisma.category.findUnique({
    where: { name: 'Music' },
  });

  const techCategory = await prisma.category.findUnique({
    where: { name: 'Technology' },
  });

  // Create sample events
  const events = [
    {
      title: 'Summer Music Festival 2024',
      description: 'Join us for the biggest music festival of the summer! Featuring top artists from around the world, amazing food vendors, and unforgettable experiences.',
      shortDescription: 'The biggest music festival of the summer',
      slug: 'summer-music-festival-2024',
      startDate: new Date('2024-07-15T18:00:00Z'),
      endDate: new Date('2024-07-15T23:00:00Z'),
      timezone: 'America/New_York',
      maxAttendees: 1000,
      price: 75.00,
      currency: 'USD',
      organizerId: organizer.id,
      venueId: downtownVenue?.id,
      featured: true,
      isPublished: true,
    },
    {
      title: 'Tech Startup Summit',
      description: 'Connect with innovative startups, investors, and industry leaders. Learn about the latest trends in technology and entrepreneurship.',
      shortDescription: 'Connect with startups and investors',
      slug: 'tech-startup-summit-2024',
      startDate: new Date('2024-08-20T09:00:00Z'),
      endDate: new Date('2024-08-20T17:00:00Z'),
      timezone: 'America/Los_Angeles',
      maxAttendees: 500,
      price: 150.00,
      currency: 'USD',
      organizerId: organizer.id,
      venueId: downtownVenue?.id,
      featured: true,
      isPublished: true,
    },
  ];

  console.log('Creating sample events...');
  for (const eventData of events) {
    const event = await prisma.event.upsert({
      where: { slug: eventData.slug },
      update: {},
      create: eventData,
    });

    // Add categories to events
    if (eventData.slug === 'summer-music-festival-2024' && musicCategory) {
      await prisma.eventCategory.upsert({
        where: {
          eventId_categoryId: {
            eventId: event.id,
            categoryId: musicCategory.id,
          },
        },
        update: {},
        create: {
          eventId: event.id,
          categoryId: musicCategory.id,
        },
      });
    }

    if (eventData.slug === 'tech-startup-summit-2024' && techCategory) {
      await prisma.eventCategory.upsert({
        where: {
          eventId_categoryId: {
            eventId: event.id,
            categoryId: techCategory.id,
          },
        },
        update: {},
        create: {
          eventId: event.id,
          categoryId: techCategory.id,
        },
      });
    }

    // Create ticket types for events
    const ticketTypes = [
      {
        name: 'General Admission',
        description: 'Standard festival access',
        price: 75.00,
        currency: 'USD',
        quantity: 800,
        eventId: event.id,
      },
      {
        name: 'VIP Pass',
        description: 'Premium access with exclusive benefits',
        price: 150.00,
        currency: 'USD',
        quantity: 200,
        eventId: event.id,
      },
    ];

    for (const ticketType of ticketTypes) {
      await prisma.ticketType.upsert({
        where: {
          eventId_name: {
            eventId: event.id,
            name: ticketType.name,
          },
        },
        update: {},
        create: ticketType,
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Default Users:');
  console.log('Admin: admin@evoke.com / admin123');
  console.log('Organizer: organizer@evoke.com / organizer123');
  console.log('User: user@evoke.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 