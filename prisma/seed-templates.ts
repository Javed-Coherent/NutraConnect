import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const systemTemplates = [
  {
    name: 'Product Inquiry',
    subject: 'Inquiry about your products - [Company Name]',
    body: `Dear Sir/Madam,

I am reaching out to inquire about your product offerings. We are interested in exploring a potential business partnership.

Could you please provide information on:
1. Your product catalog and pricing
2. Minimum order quantities
3. Payment and delivery terms
4. Any certifications (GMP, FSSAI, ISO, etc.)

We look forward to hearing from you.

Best regards,
[Your Name]
[Your Company]`,
    type: 'inquiry',
    isSystem: true,
  },
  {
    name: 'Partnership Proposal',
    subject: 'Partnership Opportunity - [Company Name]',
    body: `Dear [Contact Name],

I hope this email finds you well. I am writing to propose a mutually beneficial partnership between our organizations.

About Us:
[Brief description of your company and what you do]

Partnership Opportunity:
We believe there is significant synergy between our companies, and we would like to explore opportunities for collaboration in:
- [Area 1]
- [Area 2]
- [Area 3]

I would appreciate the opportunity to discuss this further at your convenience. Please let me know a suitable time for a call or meeting.

Looking forward to your response.

Best regards,
[Your Name]
[Your Designation]
[Your Company]`,
    type: 'partnership',
    isSystem: true,
  },
  {
    name: 'Quote Request',
    subject: 'Request for Quotation - [Product Names]',
    body: `Dear Sir/Madam,

We are interested in procuring the following products and would like to request a quotation:

Product Details:
1. Product Name: [Product 1]
   Quantity: [Quantity]
   Specifications: [Any specific requirements]

2. Product Name: [Product 2]
   Quantity: [Quantity]
   Specifications: [Any specific requirements]

Please include in your quotation:
- Unit price and total price
- Delivery timeline
- Payment terms
- Validity of the quote
- Any applicable taxes

Delivery Location: [City, State]

We look forward to your competitive offer.

Best regards,
[Your Name]
[Your Company]
[Contact Number]`,
    type: 'quote_request',
    isSystem: true,
  },
  {
    name: 'Follow-up Email',
    subject: 'Following up on our conversation - [Topic]',
    body: `Dear [Contact Name],

I hope this message finds you well. I wanted to follow up on our recent conversation regarding [topic/product/partnership].

As discussed, [summarize key points from previous conversation].

I wanted to check if you have had a chance to review our proposal/samples/documents. Please let me know if you need any additional information from our end.

Looking forward to your response.

Best regards,
[Your Name]
[Your Company]`,
    type: 'follow_up',
    isSystem: true,
  },
];

async function seedTemplates() {
  console.log('Seeding email templates...');

  for (const template of systemTemplates) {
    // Check if template already exists
    const existing = await prisma.emailTemplate.findFirst({
      where: {
        name: template.name,
        isSystem: true,
      },
    });

    if (existing) {
      console.log(`Template "${template.name}" already exists, skipping...`);
      continue;
    }

    await prisma.emailTemplate.create({
      data: template,
    });
    console.log(`Created template: ${template.name}`);
  }

  console.log('Email templates seeded successfully!');
}

seedTemplates()
  .catch((e) => {
    console.error('Error seeding templates:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
