import { Metadata } from 'next';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with NutraConnect. We\'re here to help you find the right business partners in the nutraceutical industry.',
};

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    details: 'contact@nutraconnect.in',
    subtext: 'We respond within 24 hours',
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+91 98765 43210',
    subtext: 'Mon-Sat, 9am-6pm IST',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: 'Pune',
    subtext: 'India',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: 'Mon - Sat: 9am - 6pm',
    subtext: 'Sunday: Closed',
  },
];

const faqs = [
  {
    question: 'How do I list my company on NutraConnect?',
    answer:
      'Simply sign up for a free account and complete your company profile. Our team will verify your details within 24-48 hours.',
  },
  {
    question: 'Is there a free plan available?',
    answer:
      'Yes! Our free plan includes 10 searches per day, 2 company profile views, and 2 contact reveals. Upgrade to Pro for unlimited access.',
  },
  {
    question: 'How do you verify companies?',
    answer:
      'We verify companies through GST registration, business documents, and manual verification by our team to ensure authenticity.',
  },
  {
    question: 'Can I export company data?',
    answer:
      'Pro and Enterprise users can export company data to CSV or Excel format for offline analysis and CRM integration.',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300">Contact Us</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              We&apos;d Love to{' '}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Hear From You
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Have questions about NutraConnect? Need help finding the right
              business partners? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Form Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Whether you have a question about our platform, pricing, or
                anything else, our team is ready to answer all your questions.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {contactInfo.map((item) => (
                  <Card key={item.title} className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-teal-600 dark:text-teal-400">{item.details}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtext}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-teal-100 dark:hover:bg-teal-900 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center dark:text-white">
                    <MessageSquare className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                    Send Us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          htmlFor="firstName"
                        >
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          htmlFor="lastName"
                        >
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        htmlFor="company"
                      >
                        Company Name
                      </label>
                      <Input
                        id="company"
                        placeholder="Your Company Pvt Ltd"
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        htmlFor="subject"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        htmlFor="message"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Quick answers to common questions about NutraConnect
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="dark:bg-gray-900 dark:border-gray-700">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Still have questions? We&apos;re here to help.
            </p>
            <Button variant="outline" asChild>
              <Link href="mailto:contact@nutraconnect.in">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Our Location
            </h2>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 md:h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Pune, India
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Interactive map coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
