import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function main() {
  console.log('🌱 Starting seed...');

  // ── Business causes ────────────────────────────────────────────────────────
  const businessCauses = [
    { name: 'Education', color: '#6F8FAF' },
    { name: 'Youth Sports', color: '#5FA3A8' },
    { name: 'Community Events', color: '#A88F6F' },
    { name: 'Health & Medical', color: '#C46A6A' },
    { name: 'Food & Hunger', color: '#D08A5C' },
    { name: 'Housing & Homelessness', color: '#A67C6B' },
    { name: 'Small Business Support', color: '#6FA87E' },
    { name: 'Environment', color: '#5FAF6F' },
    { name: 'Animals', color: '#CFA77A' },
    { name: 'Families & Children', color: '#D49A8A' },
    { name: 'Arts & Culture', color: '#9C7AB8' },
    { name: 'Disaster Relief', color: '#C56B6B' },
    { name: 'Veterans', color: '#6B7FA3' },
    { name: 'Public Safety', color: '#5C6F7A' },
    { name: 'Faith-Based', color: '#9A8C7C' },
    { name: 'Other Community Support', color: '#B0B7BF' },
  ];

  for (const cause of businessCauses) {
    const slug = generateSlug(cause.name);
    await prisma.cause.upsert({
      where: { slug_panel: { slug, panel: 'BUSINESS' } },
      update: { name: cause.name, color: cause.color, isActive: true },
      create: {
        name: cause.name,
        slug,
        color: cause.color,
        source: 'PREDEFINED',
        panel: 'BUSINESS',
        isActive: true,
      },
    });
  }

  console.log(`✅ ${businessCauses.length} business causes seeded`);

  // ── Skills ─────────────────────────────────────────────────────────────────

  // Delete all existing skills first
  await prisma.skill.deleteMany({});
  console.log('🗑️ Existing skills deleted');

  // Seed new predefined skills (duplicates removed)
  const skills = [
    '3D Design and Augmented Reality (AR)',
    '3D Modeling',
    'A/B Testing and Experimentation',
    'Accounting',
    'Addiction Support',
    'Advanced Prototyping and Animation',
    'Aerospace Engineering',
    'Affiliate Marketing',
    'Agile Methodology',
    'Agricultural Science',
    'Animal Care',
    'Animation',
    'APIs and Integration',
    'Architecture',
    'Artificial Intelligence',
    'Art Instruction',
    'Astronomy',
    'Audio Editing',
    'Audit',
    'Auto Mechanics',
    'Back-end Development',
    'Baking',
    'Bicycle Repair',
    'Biology',
    'Biomedical Engineering',
    'Blockchain Development',
    'Blogging',
    'Board Management',
    'Bookkeeping',
    'Brand Management',
    'Brand Storytelling',
    'Budgeting',
    'Business Analysis',
    'Business Development',
    'Career Coaching',
    'Carpentry',
    'Change Management',
    'Chemical Engineering',
    'Chemistry',
    'Child Care',
    'Civil Engineering',
    'Cloud Computing',
    'Competitive Analysis',
    'Compliance Management',
    'Conflict Resolution',
    'Construction',
    'Content Marketing',
    'Content Writing',
    'Contract Negotiation',
    'Conversion Rate Optimization',
    'Cooking',
    'Copywriting',
    'Corporate Social Responsibility',
    'Counseling',
    'CPR',
    'Creative Writing',
    'Crisis Intervention',
    'Crisis Management',
    'Crowdfunding',
    'Cultural Sensitivity Training',
    'Curriculum Development',
    'Customer Relationship Management (CRM)',
    'Customer Service',
    'Cybersecurity',
    'Dance Instruction',
    'Data Analysis',
    'Data-Driven Design',
    'Data Visualization',
    'Dentistry',
    'Design Systems and Libraries',
    'DevOps',
    'Digital Marketing',
    'Disaster Response',
    'Diversity and Inclusion Training',
    'Donor Relations',
    'E-commerce Development',
    'Editing',
    'Elder Care',
    'E-learning Development',
    'Electrical Engineering',
    'Electrical Work',
    'Email Marketing',
    'Environmental Conservation',
    'Environmental Engineering',
    'Environmental Science',
    'Epidemiology',
    'Event Planning',
    'Fashion Design',
    'Financial Management',
    'First Aid',
    'Fitness Training',
    'Food Science',
    'Front-end Development',
    'Full-stack Development',
    'Fundraising',
    'Game Design',
    'Gardening',
    'Genetics',
    'Geology',
    'Grant Writing',
    'Graphic Design',
    'Grief Counseling',
    'Home Repair',
    'Human Resources Management',
    'Illustration',
    'Industrial Design',
    'Influencer Marketing',
    'Instructional Design',
    'Intellectual Property Management',
    'Interior Design',
    'Interpretation',
    'Investment Management',
    'Journalism',
    'Knitting',
    'Landscaping',
    'Leadership Development',
    'Legal Consulting',
    'Life Coaching',
    'Lobbying',
    'Logistics Management',
    'Logo Design',
    'Machine Learning',
    'Marine Biology',
    'Market Research',
    'Mechanical Engineering',
    'Mediation',
    'Mental Health Support',
    'Mentoring',
    'Meteorology',
    'Microbiology',
    'Mobile App Development',
    'Motivational Speaking',
    'Music Instruction',
    'Negotiation',
    'Network Administration',
    'Non-profit Management',
    'Nutrition Planning',
    'Nutrition Science',
    'Operations Management',
    'Optometry',
    'Painting',
    'Pay-Per-Click (PPC) Advertising',
    'Performance Management',
    'Pet Grooming',
    'Pharmacology',
    'Photo Editing',
    'Photography',
    'Physical Therapy',
    'Physics',
    'Plumbing',
    'Podcast Production',
    'Policy Development',
    'Presentation Skills',
    'Product Design',
    'Product Management',
    'Project Management',
    'Proofreading',
    'Proposal Writing',
    'Public Health',
    'Public Relations',
    'Public Speaking',
    'Quality Assurance',
    'Quality Management',
    'Recycling and Waste Management',
    'Renewable Energy Engineering',
    'Responsive and Adaptive Design',
    'Risk Management',
    'Sales',
    'Scriptwriting',
    'Scrum Master',
    'Search and Rescue',
    'Search Engine Marketing (SEM)',
    'Search Engine Optimization (SEO)',
    'Sewing',
    'Sign Language',
    'Social Entrepreneurship',
    'Social Media Management',
    'Software Testing',
    'Special Needs Support',
    'Speechwriting',
    'Sponsorship Acquisition',
    'Sports Coaching',
    'Storytelling',
    'Strategic Planning',
    'Suicide Prevention',
    'Supply Chain Management',
    'Sustainability Management',
    'Sustainable Design',
    'Talent Acquisition',
    'Tax Planning',
    'Teaching',
    'Team Building',
    'Technical Writing',
    'Training and Development',
    'Translation',
    'Tutoring',
    'UI Design',
    'Urban Planning',
    'User Research and Usability Testing',
    'UX Design',
    'Veterinary Medicine',
    'Video Editing',
    'Video Production',
    'Visual Storytelling',
    'Voice-over',
    'Voice User Interface (VUI) Design',
    'Volunteer Coordination',
    'Web Design',
    'Web Development',
    'Web Performance Optimization',
    'Wildlife Conservation',
    'Workshop Facilitation',
    'Yoga Instruction',
    // Additional suggestions
    'Accessibility Design',
    'Advocacy and Campaigning',
    'Community Organizing',
    'Data Privacy and Ethics',
    'Disaster Preparedness',
    'Financial Literacy Coaching',
    'Language Teaching',
    'Newsletter Writing',
    'Peer Support',
    'Podcasting Strategy',
  ].sort(); // Sort alphabetically for clean DB ordering

  for (const skill of skills) {
    const slug = generateSlug(skill);
    await prisma.skill.upsert({
      where: { slug },
      update: { name: skill, isActive: true },
      create: {
        name: skill,
        slug,
        source: 'PREDEFINED',
        isActive: true,
      },
    });
  }

  console.log(`✅ ${skills.length} skills seeded`);

  // ── Blog ───────────────────────────────────────────────────────────────────
  console.log('\n📝 Seeding blog...');

  // Author
  const blogAuthor = await prisma.blogAuthor.upsert({
    where: { slug: 'mastergiver-team' },
    update: {},
    create: {
      name: 'The MasterGiver Team',
      slug: 'mastergiver-team',
      bio: 'Insights from the team building the platform for verified community impact.',
    },
  });

  // Categories
  const categoryNames = [
    'Community Impact',
    'Business Reputation',
    'Giving Back',
    'AI & Discovery',
  ];

  const categoryMap: Record<string, string> = {};
  for (const name of categoryNames) {
    const slug = generateSlug(name);
    const cat = await prisma.blogCategory.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    categoryMap[name] = cat.id;
  }
  console.log(`  ✅ ${categoryNames.length} blog categories seeded`);

  // Posts
  const blogPosts = [
    {
      title: 'The Missing Layer in Your Business Reputation',
      slug: 'missing-layer-business-reputation',
      excerpt:
        'Most businesses have invested in reviews and search visibility. But there is one reputation layer almost no business has organised — and it is the one that increasingly matters most.',
      categoryName: 'Business Reputation',
      tags: ['reputation', 'community', 'local business'],
      content: `<h2>Reviews tell customers what you do. Community involvement tells them who you are.</h2>
<p>For years, building a business reputation online meant the same three things: get found on Google, collect five-star reviews, and maybe run some ads. That formula worked well — and it still matters.</p>
<p>But something has shifted. Customers, especially local ones, are increasingly asking a different kind of question when they choose where to spend their money. Not just <em>"Are they good at what they do?"</em> but <em>"Are they good for us?"</em></p>
<h2>What community reputation actually is</h2>
<p>Community reputation is the record of how a business shows up for the people and organisations around it. Sponsorships, partnerships with local nonprofits, employee volunteering, in-kind donations, event support — the things that never make it into a Google review but that quietly build trust in a neighbourhood over years.</p>
<p>Most businesses <em>do</em> these things. They just never organise them anywhere. The involvement exists in Instagram posts from three years ago, a paragraph buried on their About page, and in the memories of people who attended an event they sponsored.</p>
<p>That is not a reputation. That is scattered goodwill that no one can find.</p>
<h2>Why it is suddenly more important</h2>
<p>Two forces are converging to make community reputation matter more than it used to.</p>
<p>First, AI recommendation engines — the tools people increasingly use to find businesses — are trained to surface trustworthy, well-rounded businesses. A business with a structured record of community involvement looks meaningfully different to an AI than one with reviews alone.</p>
<p>Second, consumer trust in traditional advertising and even in reviews has declined. People are looking for signals that are harder to fake. Genuine, documented community involvement is one of those signals.</p>
<h2>The good news</h2>
<p>You do not need to do more. You almost certainly already have involvement worth documenting. The opportunity is to organise what you already do into a structured, public record that customers, search engines, and AI tools can actually find and understand.</p>
<p>That is exactly what a MasterGiver Reputation Profile is for.</p>`,
    },
    {
      title: 'Why AI Recommends Businesses That Give Back',
      slug: 'why-ai-recommends-businesses-give-back',
      excerpt:
        'When someone asks an AI assistant to recommend a dentist or a contractor, the answer does not come from reviews alone. Here is what is actually happening — and why community involvement is becoming a competitive signal.',
      categoryName: 'AI & Discovery',
      tags: ['AI', 'search', 'reputation', 'discovery'],
      content: `<h2>The question behind the question</h2>
<p>When someone asks ChatGPT or Google Gemini to recommend a local business, they are not just looking for the highest-rated option. They are asking a more complex question: <em>Which of these businesses is trustworthy, established, and genuinely part of this community?</em></p>
<p>AI models are trained to surface the answer to that fuller question. And reviews — while still important — are just one piece of the picture they assemble.</p>
<h2>What AI models actually look for</h2>
<p>Large language models and AI search systems learn which businesses are trustworthy from the structured data available about them across the web. This includes:</p>
<ul>
<li>How consistently a business appears across multiple credible sources</li>
<li>Whether a business is mentioned in contexts beyond its own marketing</li>
<li>Whether the business has documented relationships with known organisations</li>
<li>Whether there is a coherent, cross-referenced story about what the business does and who it serves</li>
</ul>
<p>A business with a public record of sponsoring youth sports, partnering with a local food bank, and volunteering at community events has a meaningfully richer data footprint than a business with only customer reviews — even if both have a 4.8-star average.</p>
<h2>Structured data is the key</h2>
<p>The critical word is <em>structured</em>. Scattered mentions in old Facebook posts do not count. What AI models can actually process and weight is information that is organised, consistent, and accessible in a format they can read.</p>
<p>A MasterGiver Reputation Profile creates exactly that: a structured, public record of community involvement that is readable by AI systems, searchable on the web, and shareable with customers and partners.</p>
<h2>This is not about gaming algorithms</h2>
<p>It is worth being clear: this is not about tricking AI systems. It is about ensuring that the genuine community involvement your business already has is actually visible and legible to the tools people increasingly use to discover businesses.</p>
<p>If you sponsor a local little league team and no structured record of that exists anywhere, it simply does not factor into how you are perceived by AI. The involvement is real. The opportunity is to make it count.</p>`,
    },
    {
      title: 'How to Document Your Community Involvement (Even If You Think You Don\'t Have Much)',
      slug: 'how-to-document-community-involvement',
      excerpt:
        'Most business owners underestimate how much community involvement they already have. Here is a practical framework for identifying, organising, and presenting it.',
      categoryName: 'Giving Back',
      tags: ['documentation', 'community', 'small business', 'tips'],
      content: `<h2>Start with what you already do</h2>
<p>Before you think about adding anything new, take stock of what already exists. Most business owners are surprised to discover how much they have once they actually list it out.</p>
<p>Ask yourself:</p>
<ul>
<li>Have you ever sponsored a local event, team, or organisation?</li>
<li>Do you offer discounts or free services to nonprofits, schools, or community groups?</li>
<li>Have any of your employees volunteered as part of a company initiative?</li>
<li>Have you donated products, services, or time in the past three years?</li>
<li>Are you a member of a business association, chamber, or community board?</li>
</ul>
<p>If you said yes to even one of these, you have community involvement worth documenting.</p>
<h2>The three things worth capturing for every activity</h2>
<p>For each piece of involvement, you only need three things:</p>
<ol>
<li><strong>What it was</strong> — the name of the event, organisation, or initiative</li>
<li><strong>What you did</strong> — sponsored, donated, volunteered, partnered</li>
<li><strong>When it happened</strong> — even a rough year is enough to start</li>
</ol>
<p>That is a complete record. You can always add more detail later — dollar amounts, hours volunteered, photos — but those three elements are all you need to begin building a meaningful profile.</p>
<h2>Think in terms of ongoing vs. one-time</h2>
<p>One useful distinction is between ongoing involvement (the food drive you run every Thanksgiving, the nonprofit you have partnered with for years) and one-time activities (a donation after a local disaster, a single event sponsorship).</p>
<p>Both count. Both tell a story. Ongoing involvement demonstrates commitment; one-time activities demonstrate responsiveness and values. Together they create a complete picture.</p>
<h2>Start small, build over time</h2>
<p>A community reputation profile does not need to be exhaustive on day one. Even a single well-documented partnership or sponsorship is a stronger signal than nothing at all. What matters most is that the record exists, is public, and grows over time.</p>
<p>The businesses with the strongest community reputations five years from now will be the ones who started documenting today — not the ones who waited until they felt they had enough to show.</p>`,
    },
    {
      title: 'Reviews vs. Reputation: Understanding the Difference',
      slug: 'reviews-vs-reputation',
      excerpt:
        'Reviews and reputation are not the same thing. Understanding the difference — and why both matter — is one of the most important things a local business owner can do right now.',
      categoryName: 'Business Reputation',
      tags: ['reviews', 'reputation', 'trust', 'local business'],
      content: `<h2>They measure different things</h2>
<p>Customer reviews measure the experience of doing business with you. They answer the question: <em>What is it like to be your customer?</em> They are transactional by nature — one customer, one experience, one rating.</p>
<p>Reputation, in the broader sense, measures the perception of who you are as a business and as a member of your community. It answers a different question: <em>What kind of business are you, and what do you stand for?</em></p>
<p>Both questions matter. They just cannot answer each other.</p>
<h2>Why reviews are not enough on their own</h2>
<p>Reviews have a structural limitation: they only capture customers you have already served. They say nothing about how you treat people who are not yet customers — the community around your business, the organisations you support, the causes you care about.</p>
<p>They are also increasingly easy to game, which is eroding their credibility as a trust signal. Multiple studies have shown that consumers are becoming more sceptical of review averages, particularly when they are uniformly high.</p>
<h2>What reputation adds</h2>
<p>A documented community reputation adds a layer of trust signals that are significantly harder to fabricate. Verified partnerships with nonprofits, records of consistent sponsorship, documented volunteer involvement — these things require actual action to exist. They cannot be manufactured through a review campaign.</p>
<p>They also reach a different audience. Not every potential customer is going to read your reviews before they hire you. But a parent in your town who sees that you have sponsored their kid's soccer league for three years already trusts you before they ever look at a single review.</p>
<h2>The strongest businesses have both</h2>
<p>This is not an either/or. The most trusted local businesses manage their review presence carefully <em>and</em> build a documented record of community involvement. The two reinforce each other.</p>
<p>Reviews say you are good at what you do. Community involvement says you are good for the community you serve. Together, they create something no competitor can easily copy: a reputation that is earned rather than bought.</p>`,
    },
    {
      title: 'What a Verified Community Impact Profile Actually Looks Like',
      slug: 'what-verified-community-impact-profile-looks-like',
      excerpt:
        'A MasterGiver Reputation Profile is not a generic business listing. Here is exactly what it contains, what each section is for, and how customers and AI tools interact with it.',
      categoryName: 'Community Impact',
      tags: ['profile', 'mastergiver', 'reputation', 'features'],
      content: `<h2>A profile built around proof, not claims</h2>
<p>Anyone can write "We care about our community" on their website. A MasterGiver Reputation Profile is built around the opposite approach: documented evidence of specific, verifiable community involvement, presented in a structured format that both humans and AI systems can read and trust.</p>
<p>Here is what the profile actually contains.</p>
<h2>The Impact Record</h2>
<p>The core of the profile. Each entry in the Impact Record captures one piece of community involvement: a sponsorship, a donation, a volunteer initiative, a nonprofit partnership. Entries include the organisation involved, the type of contribution, the timeframe, and — where relevant — amounts or hours.</p>
<p>Over time, as entries accumulate, the record becomes a credible, cross-referenced history of how a business has shown up for its community — something that would be very difficult to fake and very easy for AI systems to extract signal from.</p>
<h2>Community Partners</h2>
<p>This section highlights ongoing relationships with nonprofits and community organisations. Unlike one-time contributions, partnerships indicate sustained commitment — and they are often mutual, meaning the partner organisation can acknowledge the relationship independently.</p>
<h2>In the Community</h2>
<p>A visual record of community involvement: photos from events, volunteer days, sponsored activities. Importantly, these are presented with context — descriptions of what the activity was, not just an image gallery.</p>
<h2>Endorsements</h2>
<p>Third-party statements from community organisations and partners who can speak to a business's involvement. These are among the most powerful trust signals in the profile, because they represent an independent voice.</p>
<h2>The Verified Impact Badge</h2>
<p>Once a profile is published and verified, businesses receive a Verified Impact Badge for use on their website, email signatures, and marketing materials. The badge links back to the full profile — giving customers a direct path to the underlying evidence rather than just a claim.</p>
<h2>Who sees it</h2>
<p>The profile is public, indexed by search engines, and structured in a way that AI recommendation tools can process. Customers who search for a business can find it. AI assistants recommending local businesses can reference it. And partners or vendors doing due diligence can review it.</p>
<p>It is, in short, the community reputation layer your business has been missing.</p>`,
    },
  ];

  let seededCount = 0;
  for (const postData of blogPosts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: postData.slug } });
    if (existing) {
      console.log(`  ⏭️  Skipped (already exists): "${postData.title}"`);
      continue;
    }

    const wordCount = postData.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const tagConnections = await Promise.all(
      postData.tags.map(async (name) => {
        const tagSlug = generateSlug(name);
        const tag = await prisma.blogTag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name, slug: tagSlug },
        });
        return { tagId: tag.id };
      })
    );

    await prisma.blogPost.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        readingTime,
        authorId: blogAuthor.id,
        categories: {
          create: [{ categoryId: categoryMap[postData.categoryName] }],
        },
        tags: { create: tagConnections },
      },
    });

    console.log(`  📝 Created: "${postData.title}"`);
    seededCount++;
  }

  console.log(`✅ ${seededCount} blog posts seeded`);

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
