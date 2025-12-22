import Link from 'next/link';
import { BadgeCheck, Shield, Phone, Mail, FileCheck, Building2, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const verificationFeatures = [
  {
    icon: FileCheck,
    title: 'GST Verification',
    description: 'Every business is verified against government GST records for authenticity',
  },
  {
    icon: Phone,
    title: 'Direct Phone Numbers',
    description: 'Get verified contact numbers of decision makers, not just generic helplines',
  },
  {
    icon: Mail,
    title: 'Business Emails',
    description: 'Verified email addresses for direct communication with companies',
  },
  {
    icon: Building2,
    title: 'Company Details',
    description: 'Complete business profiles including address, certifications, and more',
  },
];

const verificationProcess = [
  { step: '1', title: 'Data Collection', description: 'We gather business information from multiple sources' },
  { step: '2', title: 'GST Validation', description: 'Cross-verify with government GST database' },
  { step: '3', title: 'Contact Verification', description: 'Verify phone numbers and email addresses' },
  { step: '4', title: 'Regular Updates', description: 'Continuous monitoring for data accuracy' },
];

export default function VerifiedContactsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700">Trust & Verification</Badge>
            <div className="h-20 w-20 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <BadgeCheck className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Verified Contacts
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Connect with confidence. Every business on NutraConnect is GST verified
              with authentic contact information.
            </p>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/auth/signup">
                Access Verified Contacts
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sample Contact Card */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            What You Get With Each Contact
          </h2>

          <div className="max-w-md mx-auto">
            <Card className="border-2 border-emerald-200 bg-emerald-50/30 relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">Sample Nutra Pvt Ltd</h3>
                      <BadgeCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-sm text-gray-500">Manufacturer • Mumbai, Maharashtra</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">Verified</Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <FileCheck className="h-4 w-4 text-emerald-600 mr-2" />
                    <span className="text-gray-600">GST: 27AABCS1234C1ZX</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-emerald-600 mr-2" />
                    <span className="text-emerald-700 font-medium">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-emerald-600 mr-2" />
                    <span className="text-emerald-700">contact@samplenutra.com</span>
                  </div>
                </div>

                <div className="text-center pt-4 border-t">
                  <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/search">
                      <Eye className="h-4 w-4 mr-2" />
                      Browse All Companies
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-emerald-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Verification Features
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {verificationFeatures.map((feature) => (
              <Card key={feature.title} className="bg-white">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Verification Process
          </h2>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {verificationProcess.map((item, index) => (
              <div key={item.step} className="text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Connect with Verified Businesses Today
          </h2>
          <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
            No more wasted time on fake contacts. Get direct access to decision makers.
          </p>
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50" asChild>
            <Link href="/auth/signup">
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
