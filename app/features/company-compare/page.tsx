import Link from 'next/link';
import { GitCompare, CheckCircle2, XCircle, Building2, Scale, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const comparisonFeatures = [
  {
    icon: Scale,
    title: 'Side-by-Side Analysis',
    description: 'Compare up to 5 companies simultaneously with detailed metrics',
  },
  {
    icon: CheckCircle2,
    title: 'Key Metrics Comparison',
    description: 'Compare certifications, product range, capacity, and more',
  },
  {
    icon: Building2,
    title: 'Business Profile Details',
    description: 'Full company profiles including history, specializations, and contact info',
  },
  {
    icon: GitCompare,
    title: 'Export Comparisons',
    description: 'Download comparison reports for team discussions and decisions',
  },
];

export default function CompanyComparePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-teal-100 text-teal-700">Decision Tool</Badge>
            <div className="h-20 w-20 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-6">
              <GitCompare className="h-10 w-10 text-teal-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Company Compare
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Make informed decisions with side-by-side comparison of multiple companies.
              Evaluate partners based on what matters most to you.
            </p>
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700" asChild>
              <Link href="/auth/signup">
                Start Comparing
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sample Comparison Table */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Compare Companies at a Glance
          </h2>

          <div className="max-w-4xl mx-auto overflow-x-auto">
            <Card className="relative">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b">Feature</th>
                      <th className="p-4 text-center text-sm font-semibold text-gray-700 border-b">Company A</th>
                      <th className="p-4 text-center text-sm font-semibold text-gray-700 border-b">Company B</th>
                      <th className="p-4 text-center text-sm font-semibold text-gray-700 border-b">Company C</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 text-sm text-gray-600 border-b">GST Verified</td>
                      <td className="p-4 text-center border-b"><CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-4 text-center border-b"><CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-4 text-center border-b"><CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="p-4 text-sm text-gray-600 border-b">FSSAI License</td>
                      <td className="p-4 text-center border-b"><CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-4 text-center border-b"><CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-4 text-center border-b"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="p-4 text-sm text-gray-600 border-b">GMP Certified</td>
                      <td className="p-4 text-center border-b"><CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-4 text-center border-b"><XCircle className="h-5 w-5 text-gray-300 mx-auto" /></td>
                      <td className="p-4 text-center border-b"><CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="p-4 text-sm text-gray-600 border-b">Product Range</td>
                      <td className="p-4 text-center border-b text-gray-400 text-sm">50+ SKUs</td>
                      <td className="p-4 text-center border-b text-gray-400 text-sm">120+ SKUs</td>
                      <td className="p-4 text-center border-b text-gray-400 text-sm">30+ SKUs</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-sm text-gray-600 border-b">Years in Business</td>
                      <td className="p-4 text-center border-b text-gray-400 text-sm">8 years</td>
                      <td className="p-4 text-center border-b text-gray-400 text-sm">15 years</td>
                      <td className="p-4 text-center border-b text-gray-400 text-sm">5 years</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-sm text-gray-600">Contact Details</td>
                      <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                      <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>

              {/* CTA */}
              <div className="p-4 text-center border-t bg-teal-50">
                <Button className="bg-teal-600 hover:bg-teal-700" asChild>
                  <Link href="/search">
                    <Eye className="h-4 w-4 mr-2" />
                    Compare Companies Now
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Features */}
      <section className="py-16 bg-teal-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Comparison Features
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {comparisonFeatures.map((feature) => (
              <Card key={feature.title} className="bg-white">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-teal-600" />
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

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            How to Compare Companies
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Search & Select</h3>
              <p className="text-sm text-gray-600">Find companies using AI search and add them to comparison</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compare Metrics</h3>
              <p className="text-sm text-gray-600">View side-by-side comparison of all key business metrics</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Make Decision</h3>
              <p className="text-sm text-gray-600">Export report or directly contact your chosen partner</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Compare and Choose the Best Partner
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Make data-driven decisions with comprehensive company comparisons
          </p>
          <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50" asChild>
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
