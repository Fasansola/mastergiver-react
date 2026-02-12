import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@mastergiver.com' },
    update: {},
    create: {
      email: 'admin@mastergiver.com',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Seed predefined causes
  const causes = [
    { name: 'Animals', slug: 'animals', color: '#10B981', icon: '🐾' },
    {
      name: 'Children & Youth',
      slug: 'children-youth',
      color: '#F59E0B',
      icon: '👶',
    },
    {
      name: 'Disabilities',
      slug: 'disabilities',
      color: '#8B5CF6',
      icon: '♿',
    },
    {
      name: 'Disaster Relief',
      slug: 'disaster-relief',
      color: '#EF4444',
      icon: '🆘',
    },
    { name: 'Education', slug: 'education', color: '#3B82F6', icon: '📚' },
    { name: 'Elderly', slug: 'elderly', color: '#EC4899', icon: '👴' },
    { name: 'Environment', slug: 'environment', color: '#059669', icon: '🌳' },
    {
      name: 'Health & Disease',
      slug: 'health-disease',
      color: '#DC2626',
      icon: '❤️',
    },
  ];

  for (const cause of causes) {
    await prisma.cause.upsert({
      where: { slug: cause.slug },
      update: {},
      create: { ...cause, source: 'PREDEFINED' },
    });
  }

  console.log(`✅ ${causes.length} causes created`);

  // Seed predefined skills
  const skills = [
    'Mentorship',
    'Pro Bono Legal',
    'Tutoring',
    'Event Planning',
    'Graphic Design',
    'Web Development',
    'Marketing & Communications',
    'Fundraising',
    'Accounting & Finance',
    'Photography & Videography',
    'Writing & Editing',
    'Public Speaking',
    'Project Management',
    'Data Analysis',
    'Social Media Management',
  ];

  for (const skill of skills) {
    const slug = skill.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
    await prisma.skill.upsert({
      where: { slug },
      update: {},
      create: { name: skill, slug, source: 'PREDEFINED' },
    });
  }

  console.log(`✅ ${skills.length} skills created`);
  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
