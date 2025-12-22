import { Testimonial } from '../types';

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Rajesh Sharma',
    company: 'VitaHealth Distributors',
    role: 'Founder & CEO',
    content: 'NutraConnect helped us find 15 new retail partners in just 2 months. The AI-powered search is incredibly accurate and saves us hours of manual research.',
    rating: 5,
  },
  {
    id: 'testimonial-2',
    name: 'Priya Patel',
    company: 'Organic Wellness Stores',
    role: 'Procurement Head',
    content: 'As a retailer, finding verified suppliers was always challenging. With NutraConnect, I can quickly find GST-verified manufacturers and compare them side by side.',
    rating: 5,
  },
  {
    id: 'testimonial-3',
    name: 'Amit Kumar',
    company: 'FitLife Nutrition',
    role: 'Business Development Manager',
    content: 'The industry insights and news features keep us ahead of market trends. We discovered a new supplier opportunity through a news alert that led to a major partnership.',
    rating: 4,
  },
  {
    id: 'testimonial-4',
    name: 'Dr. Sneha Reddy',
    company: 'AyurCare Manufacturing',
    role: 'Director',
    content: 'We\'ve expanded our distributor network across 5 new states using NutraConnect. The platform\'s verification system gives our partners confidence in working with us.',
    rating: 5,
  },
  {
    id: 'testimonial-5',
    name: 'Vikram Singh',
    company: 'NutriMax Exports',
    role: 'Export Manager',
    content: 'Finding the right contract manufacturers for our export requirements was seamless. The detailed company profiles with certifications saved us weeks of due diligence.',
    rating: 4,
  },
  {
    id: 'testimonial-6',
    name: 'Meera Krishnan',
    company: 'Chennai Health Mart',
    role: 'Owner',
    content: 'As a small retailer, I couldn\'t afford expensive market research. NutraConnect\'s free tier gave me access to quality suppliers, and the Pro plan was worth every rupee.',
    rating: 5,
  },
];

export function getTestimonials(limit?: number): Testimonial[] {
  if (limit) {
    return testimonials.slice(0, limit);
  }
  return testimonials;
}
